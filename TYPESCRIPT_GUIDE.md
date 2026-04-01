# 📋 Guia de Uso - Versão TypeScript

## Estrutura do Projeto

```
IntrRedes/
├── NetworkPacket.js          # Versão original em JavaScript
├── NetworkPacket.ts          # Versão TypeScript com tipagem forte ✨
├── dist/
│   └── NetworkPacket.js      # Código compilado
├── package.json              # Dependências do projeto
├── tsconfig.json             # Configuração do TypeScript
├── README.md                 # Documentação completa
└── node_modules/             # Dependências instaladas
```

## 🚀 Como Executar

### Opção 1: Executar versão compilada (JavaScript)
```bash
cd c:\Users\aluga.com\Projects\IntrRedes
node dist/NetworkPacket.js
```

### Opção 2: Executar TypeScript diretamente (com ts-node)
```bash
cd c:\Users\aluga.com\Projects\IntrRedes
npm run dev
```

### Opção 3: Executar versão JavaScript original
```bash
cd c:\Users\aluga.com\Projects\IntrRedes
node NetworkPacket.js
```

## 📦 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| `build` | `npm run build` | Compila TypeScript → JavaScript |
| `start` | `npm start` | Executa versão compilada |
| `dev` | `npm run dev` | Executa TypeScript diretamente |
| `watch` | `npm run watch` | Compila em modo watch |
| `clean` | `npm run clean` | Remove pasta dist/ |

## 🔍 Diferenças: JavaScript vs TypeScript

### JavaScript (Original)
- ✅ Sem dependências
- ❌ Sem tipagem de dados
- ❌ Sem verificação em tempo de compilação
- ⚡ Execução direta

### TypeScript (Novo)
- ✅ **Tipagem forte** - Todas as variáveis e funções tipadas
- ✅ **Detecção de erros** - Erros detectados antes da execução
- ✅ **Melhor autocompletar** - IDE oferece sugestões precisas
- ✅ **Documentação automática** - JSDoc embarcado
- ✅ **Interfaces e tipos** - Modelagem de dados robusta
- 📦 Requer compilação

## 📝 Interfaces TypeScript

### `TCPFlags`
```typescript
interface TCPFlags {
  SYN: boolean;  // Sincronização
  ACK: boolean;  // Confirmação
  FIN: boolean;  // Finalização
  RST: boolean;  // Reset
  PSH: boolean;  // Push
  URG: boolean;  // Urgente
}
```

### `ConnectionInfo`
```typescript
interface ConnectionInfo {
  state: "SYN_SENT" | "SYN_RECEIVED" | "ESTABLISHED" | "CLOSED";
  seqNum: number;
  ackNum: number;
  windowSize: number;
}
```

### `NetworkStatistics`
```typescript
interface NetworkStatistics {
  totalPackets: number;
  totalBytes: number;
  droppedPackets: number;
  retransmissions: number;
}
```

## 🎯 Classes Principais

### NetworkPacket
Representa um pacote TCP/IP com propriedades tipadas.

```typescript
new NetworkPacket(
  source: string,
  destination: string,
  data: string,
  protocol: string,
  flags?: Partial<TCPFlags>
)
```

### NetworkNode
Representa um dispositivo na rede com métodos para:
- Iniciar conexão (SYN)
- Responder com SYN-ACK
- Confirmar conexão (ACK)
- Enviar e receber pacotes
- Atualizar janela de congestionamento

### Network
Gerencia simulação completa:
- Criar nós
- Configurar rotas
- Estabelecer conexões
- Enviar pacotes
- Fechar conexões
- Coletar estatísticas

## 💡 Exemplos de Uso

### Criar uma rede
```typescript
const network = new Network();
network.addNode("ClientA", "client");
network.addNode("ServerB", "server");
```

### Adicionar rotas
```typescript
network.addRoute("ClientA", "ServerB", "ServerB", 1);
```

### Estabelecer conexão TCP
```typescript
network.establishConnection("ClientA", "ServerB");
```

### Enviar dados
```typescript
network.sendPacket("ClientA", "ServerB", "Hello, Server!");
```

### Fechar conexão
```typescript
network.closeConnection("ClientA", "ServerB");
```

### Ver estatísticas
```typescript
network.showStatistics();
const stats = network.getStatistics();
console.log(`Total de pacotes: ${stats.totalPackets}`);
```

## 🔧 Configuração do TypeScript

O arquivo `tsconfig.json` está configurado com:

| Opção | Valor | Descrição |
|-------|-------|-----------|
| target | ES2020 | Versão JavaScript alvo |
| module | commonjs | Sistema de módulos |
| strict | true | Modo rigoroso ativado |
| outDir | ./dist | Pasta de saída compilada |
| declaration | true | Gera .d.ts (type definitions) |
| sourceMap | true | Gera source maps para debug |

## 🐛 Debugging

### Usar source maps
Os source maps permitem debugar o código TypeScript original:

1. Abra DevTools/Debugger
2. Defina breakpoints no arquivo `.ts`
3. Execute e o debugger para no código TypeScript

### Verificar tipos
```bash
npm run build
```
Se houver erros de tipo, a compilação falhará.

## 📊 Saída Esperada

```
╔════════════════════════════════════════════════════════════╗
║     DEMONSTRAÇÃO DE CONCEITOS TCP/IP AVANÇADOS             ║
║            Versão TypeScript com Tipagem Forte             ║
╚════════════════════════════════════════════════════════════╝

============================================================
🚀 INICIANDO HANDSHAKE TCP: ClientA ↔ ServerB
============================================================
🤝 [ClientA] STEP 1 - Enviando SYN (Seq: 4126100329)
🤝 [ServerB] STEP 2 - Respondendo com SYN-ACK...
✅ Conexão ESTABELECIDA entre ClientA e ServerB
[... mais saída ...]
```

## 🆘 Resolução de Problemas

### Erro: "npm não reconhecido"
- Reinstale Node.js
- Adicione npm ao PATH

### Erro: "TypeScript não compilado"
```bash
npm install --save-dev typescript
npm run build
```

### Erro de tipagem
```bash
npm run build
```
Verifique os erros reportados e corrija o código TypeScript.

## 📚 Recursos

- [Documentação TypeScript](https://www.typescriptlang.org/docs/)
- [RFC 793 - TCP Protocol](https://tools.ietf.org/html/rfc793)
- [Guia de Redes TCP/IP](../README.md)

## ✨ Benefícios da Versão TypeScript

1. **Segurança de tipo** - Erros detectados em compile-time
2. **Melhor performance** - Código otimizado antes de executar
3. **Manutenibilidade** - Código autodocumentado
4. **Escalabilidade** - Fácil adicionar novas features
5. **Produção-ready** - Código mais robusto

---

**Última atualização:** Abril 2026
