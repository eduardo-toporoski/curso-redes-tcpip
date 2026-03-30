class NetworkPacket {
  constructor(source, destination, data, protocol) {
    this.source = source;
    this.destination = destination;
    this.data = data;
    this.protocol = protocol;
    this.ttl = 64;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

class NetworkNode {
  constructor(id, type = "client") {
    this.id = id;
    this.type = type;
    this.routingTable = new Map();
    this.buffer = [];
  }

  send(packet) {
    console.log(`[${this.id}] Enviando pacote para ${packet.destination}`);
    this.routingTable.forEach((route, destination) => {
      if (route.next === packet.destination) {
        console.log(`  Route: ${this.id} -> ${route.next} (hop: ${route.distance})`);
      }
    });
    this.buffer.push(packet);
  }

  receive(packet) {
    console.log(`[${this.id}] Recebeu pacote de ${packet.source}: "${packet.data}"`);
    this.buffer.push(packet);
  }
}

class Network {
  constructor() {
    this.nodes = new Map();
    this.activePackets = [];
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

  sendPacket(source, destination, data, protocol = "TCP") {
    const packet = new NetworkPacket(source, destination, data, protocol);
    const sourceNode = this.nodes.get(source);
    if (sourceNode) {
      sourceNode.send(packet);
      this.activePackets.push(packet);
      this.routePacket(packet);
    }
  }

  routePacket(packet) {
    const destNode = this.nodes.get(packet.destination);
    if (destNode) {
      destNode.receive(packet);
      this.activePackets = this.activePackets.filter(p => p.id !== packet.id);
    }
  }
}

// Exemplo de uso
const network = new Network();
network.addNode("ClientA", "client");
network.addNode("Router", "router");
network.addNode("ServerB", "server");

network.addRoute("ClientA", "ServerB", "Router", 1);
network.addRoute("Router", "ServerB", "ServerB", 1);

network.sendPacket("ClientA", "ServerB", "Hello, Server!");