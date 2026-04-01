/**
 * Simulação de Rede TCP/IP - Versão TypeScript
 * Demonstra conceitos avançados de TCP com tipagem forte
 * 
 * @author Simulação Educacional
 * @version 2.0
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Interface para TCP Flags
 */
interface TCPFlags {
  SYN: boolean;  // Sincronização
  ACK: boolean;  // Confirmação
  FIN: boolean;  // Finalização
  RST: boolean;  // Reset
  PSH: boolean;  // Push
  URG: boolean;  // Urgente
}

/**
 * Interface para informações de conexão
 */
interface ConnectionInfo {
  state: "SYN_SENT" | "SYN_RECEIVED" | "ESTABLISHED" | "CLOSED";
  seqNum: number;
  ackNum: number;
  windowSize: number;
}

/**
 * Interface para tabela de roteamento
 */
interface RouteEntry {
  next: string;
  distance: number;
}

/**
 * Interface para estatísticas de rede
 */
interface NetworkStatistics {
  totalPackets: number;
  totalBytes: number;
  droppedPackets: number;
  retransmissions: number;
}

/**
 * Tipos de nó de rede
 */
type NodeType = "client" | "router" | "server";

// ============================================
// CLASSE: NetworkPacket
// ============================================

/**
 * Representa um pacote IP/TCP na rede
 */
class NetworkPacket {
  public readonly source: string;
  public readonly destination: string;
  public readonly data: string;
  public readonly protocol: string;
  public readonly ttl: number;
  public readonly id: string;
  public readonly timestamp: string;
  
  public sequenceNumber: number;
  public acknowledgmentNumber: number;
  public windowSize: number;
  public flags: TCPFlags;

  /**
   * Construtor do pacote de rede
   * 
   * @param source - Endereço de origem
   * @param destination - Endereço de destino
   * @param data - Payload do pacote
   * @param protocol - Protocolo (ex: "TCP")
   * @param flags - Flags TCP iniciais
   */
  constructor(
    source: string,
    destination: string,
    data: string,
    protocol: string,
    flags: Partial<TCPFlags> = {}
  ) {
    this.source = source;
    this.destination = destination;
    this.data = data;
    this.protocol = protocol;
    this.ttl = 64;
    this.id = Math.random().toString(36).substring(2, 11);
    this.sequenceNumber = Math.floor(Math.random() * 4294967295); // 32-bit
    this.acknowledgmentNumber = 0;
    this.windowSize = 65535; // Janela TCP padrão
    this.flags = {
      SYN: flags.SYN ?? false,
      ACK: flags.ACK ?? false,
      FIN: flags.FIN ?? false,
      RST: flags.RST ?? false,
      PSH: flags.PSH ?? false,
      URG: flags.URG ?? false
    };
    this.timestamp = new Date().toISOString();
  }

  /**
   * Retorna representação em string do pacote
   */
  toString(): string {
    const flagsStr = Object.entries(this.flags)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join("|") || "NONE";
    
    return `[Seq:${this.sequenceNumber} Ack:${this.acknowledgmentNumber} Flags:${flagsStr}] ${this.data}`;
  }
}

// ============================================
// CLASSE: NetworkNode
// ============================================

/**
 * Representa um nó (dispositivo) na rede
 */
class NetworkNode {
  private readonly id: string;
  private readonly type: NodeType;
  private readonly routingTable: Map<string, RouteEntry>;
  private readonly buffer: NetworkPacket[];
  private readonly connections: Map<string, ConnectionInfo>;
  private congestionWindow: number;
  private slowStartThreshold: number;

  /**
   * Construtor do nó de rede
   * 
   * @param id - Identificador único do nó
   * @param type - Tipo de nó (client, router, server)
   */
  constructor(id: string, type: NodeType = "client") {
    this.id = id;
    this.type = type;
    this.routingTable = new Map();
    this.buffer = [];
    this.connections = new Map();
    this.congestionWindow = 14600; // CWND
    this.slowStartThreshold = 65535; // SSTHRESH
  }

  /**
   * Getters públicos
   */
  getId(): string {
    return this.id;
  }

  getType(): NodeType {
    return this.type;
  }

  getBuffer(): NetworkPacket[] {
    return this.buffer;
  }

  getConnections(): Map<string, ConnectionInfo> {
    return this.connections;
  }

  getRoutingTable(): Map<string, RouteEntry> {
    return this.routingTable;
  }

  /**
   * Adiciona rota à tabela de roteamento
   * 
   * @param destination - Destino
   * @param nextHop - Próximo salto
   * @param distance - Distância (hops)
   */
  addRoute(destination: string, nextHop: string, distance: number): void {
    this.routingTable.set(destination, { next: nextHop, distance });
  }

  /**
   * 3-Way Handshake - STEP 1: SYN
   * Inicia conexão TCP
   * 
   * @param destination - Endereço de destino
   * @returns Pacote SYN
   */
  initiateConnection(destination: string): NetworkPacket {
    const synPacket = new NetworkPacket(
      this.id,
      destination,
      "CONNECTION_REQUEST",
      "TCP",
      { SYN: true }
    );

    console.log(
      `\n🤝 [${this.id}] STEP 1 - Enviando SYN (Seq: ${synPacket.sequenceNumber})`
    );

    this.connections.set(destination, {
      state: "SYN_SENT",
      seqNum: synPacket.sequenceNumber,
      ackNum: 0,
      windowSize: this.congestionWindow
    });

    return synPacket;
  }

  /**
   * 3-Way Handshake - STEP 2: SYN-ACK
   * Responde com sincronização e confirmação
   * 
   * @param packet - Pacote SYN recebido
   * @returns Pacote SYN-ACK
   */
  respondWithSynAck(packet: NetworkPacket): NetworkPacket {
    const synAckPacket = new NetworkPacket(
      this.id,
      packet.source,
      "CONNECTION_ACK",
      "TCP",
      { SYN: true, ACK: true }
    );

    synAckPacket.acknowledgmentNumber = packet.sequenceNumber + 1;

    console.log(
      `\n🤝 [${this.id}] STEP 2 - Respondendo com SYN-ACK (Seq: ${synAckPacket.sequenceNumber}, Ack: ${synAckPacket.acknowledgmentNumber})`
    );

    this.connections.set(packet.source, {
      state: "SYN_RECEIVED",
      seqNum: synAckPacket.sequenceNumber,
      ackNum: synAckPacket.acknowledgmentNumber,
      windowSize: this.congestionWindow
    });

    return synAckPacket;
  }

  /**
   * 3-Way Handshake - STEP 3: ACK
   * Confirma conexão TCP
   * 
   * @param packet - Pacote SYN-ACK recebido
   * @returns Pacote ACK
   */
  confirmConnection(packet: NetworkPacket): NetworkPacket {
    const ackPacket = new NetworkPacket(
      this.id,
      packet.source,
      "CONNECTION_ESTABLISHED",
      "TCP",
      { ACK: true }
    );

    ackPacket.acknowledgmentNumber = packet.sequenceNumber + 1;
    ackPacket.sequenceNumber = packet.acknowledgmentNumber;

    console.log(
      `\n🤝 [${this.id}] STEP 3 - Confirmando com ACK (Seq: ${ackPacket.sequenceNumber}, Ack: ${ackPacket.acknowledgmentNumber})`
    );

    this.connections.set(packet.source, {
      state: "ESTABLISHED",
      seqNum: ackPacket.sequenceNumber,
      ackNum: ackPacket.acknowledgmentNumber,
      windowSize: this.congestionWindow
    });

    return ackPacket;
  }

  /**
   * Envia pacote
   * 
   * @param packet - Pacote a enviar
   */
  send(packet: NetworkPacket): void {
    console.log(`\n📤 [${this.id}] Enviando pacote para ${packet.destination}`);
    console.log(`   ${packet.toString()}`);
    this.buffer.push(packet);
  }

  /**
   * Recebe pacote
   * 
   * @param packet - Pacote recebido
   */
  receive(packet: NetworkPacket): void {
    console.log(`\n📥 [${this.id}] Recebido pacote de ${packet.source}`);
    console.log(`   ${packet.toString()}`);
    this.buffer.push(packet);
  }

  /**
   * Atualiza janela de congestionamento
   * Implementa Slow Start e Congestion Avoidance
   * 
   * @param ackReceived - Se ACK foi recebido
   */
  updateCongestionWindow(ackReceived: boolean = true): void {
    if (ackReceived) {
      if (this.congestionWindow < this.slowStartThreshold) {
        // Slow Start: crescimento exponencial
        this.congestionWindow += 14600;
        console.log(`   📈 Slow Start: CWND = ${this.congestionWindow}`);
      } else {
        // Congestion Avoidance: crescimento linear
        this.congestionWindow +=
          14600 / Math.ceil(this.congestionWindow / 14600);
        console.log(`   📈 Congestion Avoidance: CWND = ${Math.ceil(this.congestionWindow)}`);
      }
    }
  }

  /**
   * Fecha conexão
   * 
   * @param destination - Destino da conexão
   */
  closeConnection(destination: string): void {
    this.connections.delete(destination);
  }
}

// ============================================
// CLASSE: Network
// ============================================

/**
 * Gerencia a simulação completa da rede TCP/IP
 */
class Network {
  private nodes: Map<string, NetworkNode>;
  private activePackets: NetworkPacket[];
  private statistics: NetworkStatistics;

  /**
   * Construtor da rede
   */
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

  /**
   * Adiciona nó à rede
   * 
   * @param id - Identificador do nó
   * @param type - Tipo de nó
   * @returns O nó criado
   */
  addNode(id: string, type: NodeType = "client"): NetworkNode {
    const node = new NetworkNode(id, type);
    this.nodes.set(id, node);
    return node;
  }

  /**
   * Adiciona rota entre nós
   * 
   * @param from - Nó de origem
   * @param to - Nó de destino
   * @param nextHop - Próximo salto
   * @param distance - Distância em hops
   */
  addRoute(
    from: string,
    to: string,
    nextHop: string,
    distance: number
  ): void {
    const node = this.nodes.get(from);
    if (node) {
      node.addRoute(to, nextHop, distance);
    }
  }

  /**
   * Estabelece conexão TCP entre dois nós (3-Way Handshake)
   * 
   * @param source - Nó de origem
   * @param destination - Nó de destino
   */
  establishConnection(source: string, destination: string): void {
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

  /**
   * Envia pacote de dados entre nós
   * 
   * @param source - Nó de origem
   * @param destination - Nó de destino
   * @param data - Dados a transmitir
   * @param protocol - Protocolo (default: "TCP")
   */
  sendPacket(
    source: string,
    destination: string,
    data: string,
    protocol: string = "TCP"
  ): void {
    const packet = new NetworkPacket(source, destination, data, protocol, {
      PSH: true,
      ACK: true
    });

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

  /**
   * Roteia pacote para destino final
   * 
   * @param packet - Pacote a rotear
   */
  private routePacket(packet: NetworkPacket): void {
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

      ackPacket.acknowledgmentNumber =
        packet.sequenceNumber + packet.data.length;

      console.log(
        `\n📬 [${packet.destination}] Enviando ACK (Ack: ${ackPacket.acknowledgmentNumber})`
      );

      const sourceNode = this.nodes.get(packet.source);
      if (sourceNode) {
        sourceNode.updateCongestionWindow(true);
        sourceNode.receive(ackPacket);
      }

      this.activePackets = this.activePackets.filter(p => p.id !== packet.id);
    }
  }

  /**
   * Fecha conexão entre dois nós
   * 
   * @param source - Nó de origem
   * @param destination - Nó de destino
   */
  closeConnection(source: string, destination: string): void {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`👋 FECHANDO CONEXÃO: ${source} ↔ ${destination}`);
    console.log(`${"=".repeat(60)}`);

    const sourceNode = this.nodes.get(source);
    const destNode = this.nodes.get(destination);

    if (!sourceNode || !destNode) return;

    // FIN
    const finPacket = new NetworkPacket(
      source,
      destination,
      "CLOSE_CONNECTION",
      "TCP",
      { FIN: true, ACK: true }
    );

    console.log(`\n👋 [${source}] Enviando FIN (Seq: ${finPacket.sequenceNumber})`);
    sourceNode.send(finPacket);
    this.statistics.totalPackets++;

    // FIN-ACK
    const finAckPacket = new NetworkPacket(
      destination,
      source,
      "CLOSE_ACK",
      "TCP",
      { FIN: true, ACK: true }
    );

    finAckPacket.acknowledgmentNumber = finPacket.sequenceNumber + 1;

    console.log(
      `\n👋 [${destination}] Enviando FIN-ACK (Ack: ${finAckPacket.acknowledgmentNumber})`
    );

    destNode.send(finAckPacket);
    this.statistics.totalPackets++;

    // Final ACK
    const finalAckPacket = new NetworkPacket(
      source,
      destination,
      "CLOSE_CONFIRM",
      "TCP",
      { ACK: true }
    );

    finalAckPacket.acknowledgmentNumber = finAckPacket.sequenceNumber + 1;

    console.log(`\n✅ [${source}] Enviando ACK final`);
    sourceNode.send(finalAckPacket);
    this.statistics.totalPackets++;

    sourceNode.closeConnection(destination);
    destNode.closeConnection(source);

    console.log(`\n✅ Conexão FECHADA`);
  }

  /**
   * Exibe estatísticas da rede
   */
  showStatistics(): void {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📊 ESTATÍSTICAS DA REDE`);
    console.log(`${"=".repeat(60)}`);
    console.log(`Total de Pacotes: ${this.statistics.totalPackets}`);
    console.log(`Total de Bytes: ${this.statistics.totalBytes}`);
    console.log(`Pacotes Descartados: ${this.statistics.droppedPackets}`);
    console.log(`Retransmissões: ${this.statistics.retransmissions}`);
    console.log(`${"=".repeat(60)}\n`);
  }

  /**
   * Obtém estatísticas da rede
   */
  getStatistics(): NetworkStatistics {
    return { ...this.statistics };
  }

  /**
   * Obtém nó específico
   * 
   * @param id - Identificador do nó
   */
  getNode(id: string): NetworkNode | undefined {
    return this.nodes.get(id);
  }
}

// ============================================
// DEMONSTRAÇÃO DE CONCEITOS TCP AVANÇADOS
// ============================================

// Criar instância da rede
const network = new Network();

// Criar nós
network.addNode("ClientA", "client");
network.addNode("Router", "router");
network.addNode("ServerB", "server");

// Configurar rotas
network.addRoute("ClientA", "ServerB", "Router", 1);
network.addRoute("Router", "ServerB", "ServerB", 1);

console.log(
  "\n╔════════════════════════════════════════════════════════════╗"
);
console.log(
  "║     DEMONSTRAÇÃO DE CONCEITOS TCP/IP AVANÇADOS             ║"
);
console.log(
  "║            Versão TypeScript com Tipagem Forte             ║"
);
console.log(
  "╚════════════════════════════════════════════════════════════╝"
);

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
  network.sendPacket(
    "ServerB",
    "ClientA",
    "Hello ClientA! Response from server"
  );
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
  console.log("\n✨ Versão TypeScript com tipagem completa!");
}, 2500);
