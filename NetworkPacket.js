class NetworkPacket {
  constructor(source, destination, data, protocol, flags = {}) {
    this.source = source;
    this.destination = destination;
    this.data = data;
    this.protocol = protocol;
    this.ttl = 64;
    this.id = Math.random().toString(36).substr(2, 9);
    this.sequenceNumber = Math.floor(Math.random() * 4294967295); // 32-bit
    this.acknowledgmentNumber = 0;
    this.windowSize = 65535; // Janela TCP padrão
    this.flags = {
      SYN: flags.SYN || false,  // Sincronização
      ACK: flags.ACK || false,  // Confirmação
      FIN: flags.FIN || false,  // Finalização
      RST: flags.RST || false,  // Reset
      PSH: flags.PSH || false,  // Push (dados prontos)
      URG: flags.URG || false   // Urgente
    };
    this.timestamp = new Date().toISOString();
  }

  toString() {
    const flagsStr = Object.entries(this.flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join('|') || 'NONE';
    return `[Seq:${this.sequenceNumber} Ack:${this.acknowledgmentNumber} Flags:${flagsStr}] ${this.data}`;
  }
}

class NetworkNode {
  constructor(id, type = "client") {
    this.id = id;
    this.type = type;
    this.routingTable = new Map();
    this.buffer = [];
    this.connections = new Map(); // {destinationId: {state, seqNum, ackNum, windowSize}}
    this.congestionWindow = 14600; // CWND - Controle de congestionamento
    this.slowStartThreshold = 65535; // SSTHRESH
    this.rtt = 0; // Round Trip Time
    this.rto = 1000; // Retransmission Timeout (ms)
  }

  // 3-Way Handshake - STEP 1: SYN
  initiateConnection(destination) {
    const synPacket = new NetworkPacket(this.id, destination, "CONNECTION_REQUEST", "TCP", { SYN: true });
    console.log(`\n🤝 [${this.id}] STEP 1 - Enviando SYN (Seq: ${synPacket.sequenceNumber})`);
    this.connections.set(destination, {
      state: "SYN_SENT",
      seqNum: synPacket.sequenceNumber,
      ackNum: 0,
      windowSize: this.congestionWindow
    });
    return synPacket;
  }

  // 3-Way Handshake - STEP 2: SYN-ACK
  respondWithSynAck(packet) {
    const synAckPacket = new NetworkPacket(
      this.id,
      packet.source,
      "CONNECTION_ACK",
      "TCP",
      { SYN: true, ACK: true }
    );
    synAckPacket.acknowledgmentNumber = packet.sequenceNumber + 1;
    console.log(`\n🤝 [${this.id}] STEP 2 - Respondendo com SYN-ACK (Seq: ${synAckPacket.sequenceNumber}, Ack: ${synAckPacket.acknowledgmentNumber})`);
    this.connections.set(packet.source, {
      state: "SYN_RECEIVED",
      seqNum: synAckPacket.sequenceNumber,
      ackNum: synAckPacket.acknowledgmentNumber,
      windowSize: this.congestionWindow
    });
    return synAckPacket;
  }

  // 3-Way Handshake - STEP 3: ACK
  confirmConnection(packet) {
    const ackPacket = new NetworkPacket(
      this.id,
      packet.source,
      "CONNECTION_ESTABLISHED",
      "TCP",
      { ACK: true }
    );
    ackPacket.acknowledgmentNumber = packet.sequenceNumber + 1;
    ackPacket.sequenceNumber = packet.acknowledgmentNumber;
    console.log(`\n🤝 [${this.id}] STEP 3 - Confirmando com ACK (Seq: ${ackPacket.sequenceNumber}, Ack: ${ackPacket.acknowledgmentNumber})`);
    this.connections.set(packet.source, {
      state: "ESTABLISHED",
      seqNum: ackPacket.sequenceNumber,
      ackNum: ackPacket.acknowledgmentNumber,
      windowSize: this.congestionWindow
    });
    return ackPacket;
  }

  send(packet) {
    console.log(`\n📤 [${this.id}] Enviando pacote para ${packet.destination}`);
    console.log(`   ${packet.toString()}`);
    this.buffer.push(packet);
  }

  receive(packet) {
    console.log(`\n📥 [${this.id}] Recebido pacote de ${packet.source}`);
    console.log(`   ${packet.toString()}`);
    this.buffer.push(packet);
  }

  updateCongestionWindow(ackReceived = true) {
    if (ackReceived) {
      if (this.congestionWindow < this.slowStartThreshold) {
        this.congestionWindow += 14600; // Slow Start
        console.log(`   📈 Slow Start: CWND = ${this.congestionWindow}`);
      } else {
        this.congestionWindow += 14600 / Math.ceil(this.congestionWindow / 14600); // Congestion Avoidance
        console.log(`   📈 Congestion Avoidance: CWND = ${Math.ceil(this.congestionWindow)}`);
      }
    }
  }
}

class Network {
  constructor() {
    this.nodes = new Map();
    this.activePackets = [];
    this.statistics = {
      totalPackets: 0,
      totalBytes: 0,
      droppedPackets: 0,
      retransmissions: 0
    };
  }

  addNode(id, type) {
    const node = new NetworkNode(id, type);
    this.nodes.set(id, node);
    return node;
  }

  addRoute(from, to, nextHop, distance) {
    const node = this.nodes.get(from);
    if (node) {
      node.routingTable.set(to, { next: nextHop, distance });
    }
  }

  // 3-Way Handshake
  establishConnection(source, destination) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🚀 INICIANDO HANDSHAKE TCP: ${source} ↔ ${destination}`);
    console.log(`${"=".repeat(60)}`);

    const sourceNode = this.nodes.get(source);
    const destNode = this.nodes.get(destination);

    if (!sourceNode || !destNode) {
      console.log("❌ Nó não encontrado!");
      return;
    }

    // Step 1: SYN
    const synPacket = sourceNode.initiateConnection(destination);
    this.statistics.totalPackets++;
    this.activePackets.push(synPacket);

    // Step 2: SYN-ACK
    const synAckPacket = destNode.respondWithSynAck(synPacket);
    this.statistics.totalPackets++;
    this.activePackets.push(synAckPacket);

    // Step 3: ACK
    const ackPacket = sourceNode.confirmConnection(synAckPacket);
    this.statistics.totalPackets++;
    this.activePackets.push(ackPacket);

    console.log(`\n✅ Conexão ESTABELECIDA entre ${source} e ${destination}`);
  }

  sendPacket(source, destination, data, protocol = "TCP") {
    const packet = new NetworkPacket(source, destination, data, protocol, { PSH: true, ACK: true });
    const sourceNode = this.nodes.get(source);
    const destNode = this.nodes.get(destination);

    if (sourceNode && destNode) {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`📨 ENVIANDO DADOS: ${source} → ${destination}`);
      console.log(`${"=".repeat(60)}`);
      sourceNode.send(packet);
      this.activePackets.push(packet);
      this.statistics.totalPackets++;
      this.statistics.totalBytes += data.length;
      this.routePacket(packet);
    }
  }

  routePacket(packet) {
    const destNode = this.nodes.get(packet.destination);
    if (destNode) {
      destNode.receive(packet);
      
      // Simular ACK de recebimento
      const ackPacket = new NetworkPacket(
        packet.destination,
        packet.source,
        "DATA_RECEIVED",
        "TCP",
        { ACK: true }
      );
      ackPacket.acknowledgmentNumber = packet.sequenceNumber + packet.data.length;
      console.log(`\n📬 [${packet.destination}] Enviando ACK (Ack: ${ackPacket.acknowledgmentNumber})`);
      
      const sourceNode = this.nodes.get(packet.source);
      if (sourceNode) {
        sourceNode.updateCongestionWindow(true);
        sourceNode.receive(ackPacket);
      }
      
      this.activePackets = this.activePackets.filter(p => p.id !== packet.id);
    }
  }

  closeConnection(source, destination) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`👋 FECHANDO CONEXÃO: ${source} ↔ ${destination}`);
    console.log(`${"=".repeat(60)}`);

    const sourceNode = this.nodes.get(source);
    const destNode = this.nodes.get(destination);

    if (!sourceNode || !destNode) return;

    // FIN
    const finPacket = new NetworkPacket(source, destination, "CLOSE_CONNECTION", "TCP", { FIN: true, ACK: true });
    console.log(`\n👋 [${source}] Enviando FIN (Seq: ${finPacket.sequenceNumber})`);
    sourceNode.send(finPacket);
    this.statistics.totalPackets++;

    // FIN-ACK
    const finAckPacket = new NetworkPacket(destination, source, "CLOSE_ACK", "TCP", { FIN: true, ACK: true });
    finAckPacket.acknowledgmentNumber = finPacket.sequenceNumber + 1;
    console.log(`\n👋 [${destination}] Enviando FIN-ACK (Ack: ${finAckPacket.acknowledgmentNumber})`);
    destNode.send(finAckPacket);
    this.statistics.totalPackets++;

    // Final ACK
    const finalAckPacket = new NetworkPacket(source, destination, "CLOSE_CONFIRM", "TCP", { ACK: true });
    finalAckPacket.acknowledgmentNumber = finAckPacket.sequenceNumber + 1;
    console.log(`\n✅ [${source}] Enviando ACK final`);
    sourceNode.send(finalAckPacket);
    this.statistics.totalPackets++;

    sourceNode.connections.delete(destination);
    destNode.connections.delete(source);
    console.log(`\n✅ Conexão FECHADA`);
  }

  showStatistics() {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📊 ESTATÍSTICAS DA REDE`);
    console.log(`${"=".repeat(60)}`);
    console.log(`Total de Pacotes: ${this.statistics.totalPackets}`);
    console.log(`Total de Bytes: ${this.statistics.totalBytes}`);
    console.log(`Pacotes Descartados: ${this.statistics.droppedPackets}`);
    console.log(`Retransmissões: ${this.statistics.retransmissions}`);
    console.log(`${"=".repeat(60)}\n`);
  }
}

// ============================================
// DEMONSTRAÇÃO DE CONCEITOS TCP AVANÇADOS
// ============================================

const network = new Network();

// Criar nós
network.addNode("ClientA", "client");
network.addNode("Router", "router");
network.addNode("ServerB", "server");

// Configurar rotas
network.addRoute("ClientA", "ServerB", "Router", 1);
network.addRoute("Router", "ServerB", "ServerB", 1);

console.log("\n╔════════════════════════════════════════════════════════════╗");
console.log("║     DEMONSTRAÇÃO DE CONCEITOS TCP/IP AVANÇADOS             ║");
console.log("╚════════════════════════════════════════════════════════════╝");

// 1. Estabelecer conexão (3-Way Handshake)
network.establishConnection("ClientA", "ServerB");

// 2. Enviar dados
setTimeout(() => {
  network.sendPacket("ClientA", "ServerB", "Hello, Server! This is message 1");
}, 500);

setTimeout(() => {
  network.sendPacket("ClientA", "ServerB", "Here is message 2");
}, 1000);

setTimeout(() => {
  network.sendPacket("ServerB", "ClientA", "Hello ClientA! Response from server");
}, 1500);

// 3. Fechar conexão (TCP Connection Termination)
setTimeout(() => {
  network.closeConnection("ClientA", "ServerB");
}, 2000);

// 4. Mostrar estatísticas
setTimeout(() => {
  network.showStatistics();
  console.log("\n📚 CONCEITOS DEMONSTRADOS:");
  console.log("   ✓ TCP Flags (SYN, ACK, FIN, PSH)");
  console.log("   ✓ Números de Sequência (32-bit)");
  console.log("   ✓ Números de Confirmação (ACK)");
  console.log("   ✓ Janela de Congestionamento (CWND)");
  console.log("   ✓ 3-Way Handshake");
  console.log("   ✓ Transmissão Confiável de Dados");
  console.log("   ✓ Fechamento de Conexão (FIN)");
  console.log("   ✓ Controle de Fluxo com Window Size");
}, 2500);