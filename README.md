# 🌐 Simulação de Rede TCP/IP - Conceitos Avançados

Uma demonstração educacional interativa dos conceitos fundamentais e avançados do protocolo TCP (Transmission Control Protocol) através de simulação de pacotes de rede em **JavaScript** e **TypeScript** com Node.js.

**Versões Disponíveis:**
- 📄 **JavaScript** (`NetworkPacket.js`) - Versão original, sem dependências
- ✨ **TypeScript** (`NetworkPacket.ts`) - Versão com tipagem forte completa

## 📚 Índice

1. [Visão Geral](#visão-geral)
2. [Versões Disponíveis](#versões-disponíveis)
3. [Como Executar](#como-executar)
4. [Arquitetura](#arquitetura)
5. [Conceitos TCP Explicados](#conceitos-tcp-explicados)
6. [Fluxo de Execução](#fluxo-de-execução)
7. [Exemplos de Saída](#exemplos-de-saída)

---

## 🎯 Visão Geral

Este projeto implementa uma simulação educacional de uma rede TCP/IP, demonstrando:

- ✅ **3-Way Handshake** - Estabelecimento de conexão
- ✅ **Números de Sequência** - Rastreamento ordenado de dados
- ✅ **Confirmação (ACK)** - Garantia de entrega
- ✅ **TCP Flags** - Controle de conexão
- ✅ **Janela de Congestionamento** - Controle de fluxo
- ✅ **Finalização de Conexão** - Encerramento gracioso
- ✅ **Roteamento** - Movimento de pacotes pela rede

---

## 📦 Versões Disponíveis

### JavaScript (`NetworkPacket.js`)
```bash
# Executar diretamente
node NetworkPacket.js
```
- ✅ Sem dependências externas
- ✅ Executa imediatamente
- ❌ Sem verificação de tipos
- ⚡ Ideal para aprendizado rápido

### TypeScript (`NetworkPacket.ts`) ✨ NOVO
```bash
# Opção 1: Executar compilado (Recomendado)
node dist/NetworkPacket.js

# Opção 2: Executar TypeScript direto
npm run dev

# Opção 3: Compilar manualmente
npm run build
npm start
```
- ✅ Tipagem forte completa
- ✅ Detecção de erros em compile-time
- ✅ IntelliSense perfeito
- ✅ Documentação automática (JSDoc)
- ✅ Production-ready
- 📦 Requer compilação (ou ts-node)

**Para usar TypeScript, instale as dependências:**
```bash
npm install
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js v12 ou superior instalado
- (Opcional) npm packages para TypeScript - `npm install`

### Execução Rápida

**JavaScript (sem setup):**
```bash
cd c:\Users\aluga.com\Projects\IntrRedes
node NetworkPacket.js
```

**TypeScript (com tipagem):**
```bash
cd c:\Users\aluga.com\Projects\IntrRedes
npm install    # (primeira vez apenas)
npm run dev    # Executa TypeScript direto
```

Ou compilar e executar:
```bash
npm run build  # Compila para dist/
npm start      # Executa versão compilada
```

### Saída Esperada
```
╔════════════════════════════════════════════════════════════╗
║     DEMONSTRAÇÃO DE CONCEITOS TCP/IP AVANÇADOS             ║
╚════════════════════════════════════════════════════════════╝

🚀 INICIANDO HANDSHAKE TCP: ClientA ↔ ServerB
============================================================
🤝 [ClientA] STEP 1 - Enviando SYN (Seq: 2487930141)
🤝 [ServerB] STEP 2 - Respondendo com SYN-ACK (Seq: 4152891894, Ack: 2487930142)
🤝 [ClientA] STEP 3 - Confirmando com ACK (Seq: 2487930142, Ack: 4152891895)
✅ Conexão ESTABELECIDA entre ClientA e ServerB
```

---

## 🏗️ Arquitetura

### Estrutura do Projeto

```
IntrRedes/
├── NetworkPacket.js          # Versão JavaScript (original)
├── NetworkPacket.ts          # Versão TypeScript ✨ (com tipagem)
├── dist/
│   └── NetworkPacket.js      # Compilado (gerado após npm run build)
├── package.json              # Dependências
├── tsconfig.json             # Configuração TypeScript
├── README.md                 # Este arquivo
├── TYPESCRIPT_GUIDE.md       # Guia detalhado TypeScript
├── SUMMARY.md                # Resumo executivo
└── node_modules/             # Dependências instaladas
```

### Classes Principais (Versão TypeScript com Tipagem)

#### 1. **NetworkPacket**
Representa um pacote IP/TCP na rede.

```typescript
// TypeScript com tipos completos
class NetworkPacket {
  public readonly source: string;
  public readonly destination: string;
  public readonly data: string;
  public readonly protocol: string;
  public readonly ttl: number;
  public readonly id: string;
  public sequenceNumber: number;
  public acknowledgmentNumber: number;
  public windowSize: number;
  public flags: TCPFlags;
  
  toString(): string;
}

interface TCPFlags {
  SYN: boolean;  // Sincronização
  ACK: boolean;  // Confirmação
  FIN: boolean;  // Finalização
  RST: boolean;  // Reset
  PSH: boolean;  // Push
  URG: boolean;  // Urgente
}
```

#### 2. **NetworkNode**
Representa um dispositivo na rede (cliente, roteador, servidor).

```typescript
// TypeScript com tipos completos
class NetworkNode {
  private id: string;
  private type: NodeType;
  private routingTable: Map<string, RouteEntry>;
  private connections: Map<string, ConnectionInfo>;
  
  // Métodos principais
  initiateConnection(destination: string): NetworkPacket;
  respondWithSynAck(packet: NetworkPacket): NetworkPacket;
  confirmConnection(packet: NetworkPacket): NetworkPacket;
  send(packet: NetworkPacket): void;
  receive(packet: NetworkPacket): void;
  updateCongestionWindow(ackReceived?: boolean): void;
}

type NodeType = "client" | "router" | "server";

interface ConnectionInfo {
  state: "SYN_SENT" | "SYN_RECEIVED" | "ESTABLISHED" | "CLOSED";
  seqNum: number;
  ackNum: number;
  windowSize: number;
}
```

#### 3. **Network**
Gerencia a simulação completa da rede TCP/IP.

```typescript
class Network {
  private nodes: Map<string, NetworkNode>;
  private activePackets: NetworkPacket[];
  private statistics: NetworkStatistics;
  
  // Métodos principais
  addNode(id: string, type: NodeType): NetworkNode;
  addRoute(from: string, to: string, nextHop: string, distance: number): void;
  establishConnection(source: string, destination: string): void;
  sendPacket(source: string, destination: string, data: string, protocol?: string): void;
  closeConnection(source: string, destination: string): void;
  showStatistics(): void;
  getStatistics(): NetworkStatistics;
}

interface NetworkStatistics {
  totalPackets: number;
  totalBytes: number;
  droppedPackets: number;
  retransmissions: number;
}
```

---

### Comparação: JavaScript vs TypeScript

| Recurso | JavaScript | TypeScript |
|---------|-----------|-----------|
| **Tipagem** | ❌ Nenhuma | ✅ Completa |
| **Interfaces** | ❌ Não | ✅ Sim (4 interfaces) |
| **Type Aliases** | ❌ Não | ✅ Sim (NodeType) |
| **Encapsulamento** | 🟡 Por convenção | ✅ Nativo (private/public) |
| **IntelliSense** | 🟡 Parcial | ✅ Completo |
| **Detecção de erros** | ❌ Runtime | ✅ Compile-time |
| **Refatoração** | 🟡 Manual | ✅ Segura |
| **Dependências** | 0 | npm install required |
| **Build** | Nenhum | TypeScript → JavaScript |

---

## 🔍 Conceitos TCP Explicados

### 1. **TCP Flags** 🚩

Flags são bits de controle que indicam o tipo de pacote TCP:

| Flag | Nome | Descrição | Exemplo |
|------|------|-----------|---------|
| **SYN** | Synchronize | Solicita sincronização (inicia conexão) | 3-Way Handshake Step 1 |
| **ACK** | Acknowledgment | Confirma recebimento de dados | 3-Way Handshake Step 3 |
| **FIN** | Finish | Solicita encerramento de conexão | TCP Connection Close |
| **RST** | Reset | Redefine/aborta conexão | Erro ou timeout |
| **PSH** | Push | Envia dados imediatamente | Transferência de dados |
| **URG** | Urgent | Dados urgentes | Controle especial |

**Exemplo na saída:**
```
[Seq:1179086097 Ack:0 Flags:ACK|PSH] Hello, Server! This is message 1
                             ^^^^^^
                      Múltiplas flags ativas
```

---

### 2. **Números de Sequência** 🔢

- **Conceito**: Identificadores únicos para cada byte de dados em uma conexão TCP
- **Tamanho**: 32-bit (0 até 4.294.967.295)
- **Propósito**: 
  - Ordenar pacotes corretamente
  - Detectar pacotes duplicados
  - Implementar retransmissão

**Exemplo de fluxo:**
```
[ClientA] Seq: 2487930141
          ↓
[ServerB] Ack: 2487930142  ← Reconhece até byte 2487930141 (seq + 1)
```

---

### 3. **Números de Confirmação (ACK)** ✅

- **Conceito**: Confirma recebimento de dados de sequência anterior
- **Valor**: Próximo número de sequência esperado
- **Confiabilidade**: Garante que o lado remoto recebeu os dados

**Cálculo:**
```
ACK = Seq_recebido + len(dados)
```

**Exemplo:**
```
Dado enviado: Seq:1000, Data:"HELLO" (5 bytes)
ACK resposta: Ack:1005 (1000 + 5)
```

---

### 4. **3-Way Handshake** 🤝

O processo fundamental para estabelecer uma conexão TCP confiável:

#### **Step 1: SYN (Synchronize)**
```
ClientA → ServerB
Flags: SYN
Seq: 2487930141 (número aleatório)
Propósito: "Quero conectar, sincronizemos"
```

#### **Step 2: SYN-ACK (Synchronize-Acknowledge)**
```
ServerB → ClientA
Flags: SYN + ACK
Seq: 4152891894 (número aleatório do servidor)
Ack: 2487930142 (confirma recebimento do SYN)
Propósito: "OK, conectar, confirmando seu SYN"
```

#### **Step 3: ACK (Acknowledge)**
```
ClientA → ServerB
Flags: ACK
Seq: 2487930142 (próximo da sequência esperada)
Ack: 4152891895 (confirma recebimento do SYN-ACK)
Propósito: "Confirmado, conexão estabelecida"
```

**Diagrama Temporal:**
```
ClientA                        ServerB
  |                              |
  |---- SYN (Seq=2487930141) --->|
  |                              |
  |<-- SYN-ACK (Seq=4152891894) -|
  |        (Ack=2487930142)      |
  |                              |
  |---- ACK (Seq=2487930142) --->|
  |     (Ack=4152891895)         |
  |                              |
  |====== CONEXÃO ABERTA ========|
```

---

### 5. **Janela de Congestionamento (CWND)** 📈

Controla quantos bytes podem ser enviados sem confirmação para evitar congestionamento:

#### **Estados:**

1. **Slow Start** (início lento)
   - CWND cresce exponencialmente
   - Dobra a cada RTT (Round Trip Time)
   - Formula: `CWND = CWND + 14600`
   
   ```
   CWND: 14600 → 29200 → 43800 → ...
   ```

2. **Congestion Avoidance** (depois de SSTHRESH)
   - Crescimento linear
   - Formula: `CWND = CWND + 14600/CWND`

#### **Na Saída:**
```
📈 Slow Start: CWND = 29200
📈 Slow Start: CWND = 43800
```

---

### 6. **Janela de Fluxo (Window Size)** 📏

- **Padrão**: 65.535 bytes
- **Função**: Indica ao remetente quanto dado pode enviar
- **Controle**: Receptor pode reduzir para desacelerar envio

```javascript
windowSize: 65535  // Pode receber até 65KB
```

---

### 7. **TTL (Time To Live)** ⏱️

- **Valor**: 64 (configuração padrão)
- **Função**: Limita número de hops (roteadores)
- **Decréscimo**: -1 a cada roteador
- **Propósito**: Evita loops infinitos na rede

**Exemplo:**
```
ClientA → Router → ServerB
TTL: 64 → 63 → 62
```

---

### 8. **Fechamento de Conexão (FIN)** 👋

Processo para encerrar graciosamente uma conexão TCP:

#### **Step 1: FIN**
```
ClientA → ServerB
Flags: FIN + ACK
Mensagem: "Terminei de enviar dados"
```

#### **Step 2: FIN-ACK**
```
ServerB → ClientA
Flags: FIN + ACK
Mensagem: "Ack recebido, também vou fechar"
```

#### **Step 3: ACK Final**
```
ClientA → ServerB
Flags: ACK
Mensagem: "Confirmado, conexão encerrada"
```

**Resultado:** Ambos os lados sem conexão ativa.

---

### 9. **Roteamento** 🛣️

Processo de movimento de pacotes através da rede:

```javascript
// Tabela de Roteamento
ClientA:
  ServerB → via Router (1 hop)

Router:
  ServerB → Direto (1 hop)
```

**Fluxo:**
```
ClientA ─→ Consulta tabela ─→ Envia para Router ─→ Router consulta ─→ Entrega em ServerB
```

---

### 10. **Transmissão Confiável** 🔒

Combinação de mecanismos que garantem entrega:

1. **Números de Sequência** - Ordenação
2. **ACK** - Confirmação de recebimento
3. **Retransmissão** - Se não receber ACK em tempo (RTO)
4. **Checksum** - Verificação de integridade

**Processo:**
```
[Enviar] → [Esperar ACK] → [Se timeout: Retransmitir]
                              ↑
                         RTO = Retransmission Timeout
```

---

## 📊 Fluxo de Execução

```
┌─────────────────────────────────────────────────────────────┐
│ 1. INICIALIZAR REDE                                         │
│    • Criar nós (ClientA, Router, ServerB)                   │
│    • Configurar tabelas de roteamento                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. 3-WAY HANDSHAKE                                          │
│    • ClientA envia SYN                                      │
│    • ServerB responde SYN-ACK                               │
│    • ClientA confirma com ACK                               │
│    • Conexão ESTABELECIDA                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. TRANSFERÊNCIA DE DADOS                                   │
│    • ClientA envia mensagem 1 (PSH+ACK)                     │
│    • ServerB recebe e envia ACK                             │
│    • ClientA envia mensagem 2 (PSH+ACK)                     │
│    • ServerB recebe e envia ACK                             │
│    • ServerB envia resposta (PSH+ACK)                       │
│    • ClientA recebe e envia ACK                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. FECHAMENTO DE CONEXÃO                                    │
│    • ClientA envia FIN                                      │
│    • ServerB responde FIN-ACK                               │
│    • ClientA envia ACK final                                │
│    • Conexão FECHADA                                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. EXIBIR ESTATÍSTICAS                                      │
│    • Total de pacotes: 9                                    │
│    • Total de bytes: 84                                     │
│    • Pacotes descartados: 0                                 │
│    • Retransmissões: 0                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Exemplos de Saída

### Handshake TCP
```
============================================================
🚀 INICIANDO HANDSHAKE TCP: ClientA ↔ ServerB
============================================================

🤝 [ClientA] STEP 1 - Enviando SYN (Seq: 2487930141)

🤝 [ServerB] STEP 2 - Respondendo com SYN-ACK (Seq: 4152891894, Ack: 2487930142)

🤝 [ClientA] STEP 3 - Confirmando com ACK (Seq: 2487930142, Ack: 4152891895)

✅ Conexão ESTABELECIDA entre ClientA e ServerB
```

### Transferência de Dados
```
============================================================
📨 ENVIANDO DADOS: ClientA → ServerB
============================================================

📤 [ClientA] Enviando pacote para ServerB
   [Seq:1179086097 Ack:0 Flags:ACK|PSH] Hello, Server! This is message 1

📥 [ServerB] Recebido pacote de ClientA
   [Seq:1179086097 Ack:0 Flags:ACK|PSH] Hello, Server! This is message 1

📬 [ServerB] Enviando ACK (Ack: 1179086129)
   📈 Slow Start: CWND = 29200

📥 [ClientA] Recebido pacote de ServerB
   [Seq:2214284314 Ack:1179086129 Flags:ACK] DATA_RECEIVED
```

### Fechamento de Conexão
```
============================================================
👋 FECHANDO CONEXÃO: ClientA ↔ ServerB
============================================================

👋 [ClientA] Enviando FIN (Seq: 3937860454)
👋 [ServerB] Enviando FIN-ACK (Ack: 3937860455)
✅ [ClientA] Enviando ACK final

✅ Conexão FECHADA
```

### Estatísticas
```
============================================================
📊 ESTATÍSTICAS DA REDE
============================================================
Total de Pacotes: 9
Total de Bytes: 84
Pacotes Descartados: 0
Retransmissões: 0
============================================================
```

---

## 📖 Comparação com Protocolo UDP

| Aspecto | TCP | UDP |
|---------|-----|-----|
| **Confiável** | ✅ Sim (ACK) | ❌ Não |
| **Ordenado** | ✅ Sim (Seq#) | ❌ Não |
| **Handshake** | ✅ 3-Way | ❌ Nenhum |
| **Velocidade** | 🟡 Mais lento | ⚡ Mais rápido |
| **Overhead** | 🟡 Maior | ⚡ Menor |
| **Uso** | HTTP, FTP, SSH | DNS, Vídeo, Jogos |

---

## 🎓 Conceitos de Camadas OSI

Este projeto demonstra principalmente:

```
┌─────────────────────────────┐
│ 7. Aplicação (HTTP, FTP)    │
├─────────────────────────────┤
│ 6. Apresentação             │
├─────────────────────────────┤
│ 5. Sessão                   │
├─────────────────────────────┤
│ 4. TRANSPORTE (TCP) ← AQUI! │
├─────────────────────────────┤
│ 3. Rede (IP) ← Roteamento   │
├─────────────────────────────┤
│ 2. Enlace (Ethernet)        │
├─────────────────────────────┤
│ 1. Física                   │
└─────────────────────────────┘
```

---

## 🔧 Estrutura de Arquivos

```
IntrRedes/
├── NetworkPacket.js    ← Script principal
├── README.md           ← Este arquivo
└── node_modules/       (se necessário)
```

---

## 📚 Referências e Recursos

### RFCs Importantes
- **RFC 793** - Transmission Control Protocol (TCP)
- **RFC 5681** - TCP Congestion Control
- **RFC 3168** - The Addition of Explicit Congestion Notification (ECN)

### Conceitos Avançados (Não implementados nesta simulação)
- Retransmissão adaptativa (RENO, CUBIC)
- SACK (Selective Acknowledgment)
- TCP Fast Recovery
- Detecção de pacotes perdidos
- Algoritmos de jitter buffer

---

## 🚀 Possíveis Extensões

1. **Simulação de Perda de Pacotes**
   ```javascript
   if (Math.random() < 0.1) { // 10% perda
     this.statistics.droppedPackets++;
     return;
   }
   ```

2. **Latência de Rede**
   ```javascript
   setTimeout(() => destNode.receive(packet), latencyMs);
   ```

3. **Múltiplas Conexões Simultâneas**
   ```javascript
   network.establishConnection("ClientA", "ServerB");
   network.establishConnection("ClientC", "ServerB");
   ```

4. **Simulação de Congestionamento**
   ```javascript
   if (this.activePackets.length > threshold) {
     // Reduzir CWND
   }
   ```

5. **Visualização em Tempo Real**
   - Integração com D3.js ou Three.js
   - Animação de pacotes
   - Gráficos de largura de banda

---

## 📝 Notas Educacionais

Este projeto é um **modelo simplificado** para fins educacionais. Implementações reais de TCP são muito mais complexas e incluem:

- Tratamento de erros robusto
- Otimizações de desempenho
- Segurança (SSL/TLS)
- Multiplexação
- Buffers adaptativos
- Algoritmos de congestionamento sofisticados

**Use como ferramenta de aprendizado, não em produção! 🎓**

---

## 👨‍💻 Autor

Criado como material educacional para demonstrar conceitos fundamentais de TCP/IP

---

## 📄 Licença

Este projeto é de código aberto e disponível para fins educacionais.

## 🎓 Guias Adicionais

Para informações detalhadas sobre como usar a versão TypeScript, consulte:

- **[TYPESCRIPT_GUIDE.md](TYPESCRIPT_GUIDE.md)** - Guia completo de uso do TypeScript
- **[SUMMARY.md](SUMMARY.md)** - Resumo executivo e quick-start
- **[package.json](package.json)** - Scripts disponíveis (build, dev, start, watch, clean)

---

**Última atualização:** Abril 2026 | **Versão:** 2.0 TypeScript + JavaScript
