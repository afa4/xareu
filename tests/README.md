# 🧪 Testes - Xaréu Bot

## 📦 Instalação

```bash
npm install
```

## 🚀 Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar com cobertura
npm run test:coverage

# Executar com mais detalhes
npm run test:verbose
```

## 📁 Estrutura de Testes

```
tests/
├── fixtures/               # Mocks e dados de teste
│   ├── mockDiscordClient.ts
│   └── mockVoiceConnection.ts
├── unit/                   # Testes unitários
│   ├── services/
│   │   └── VoiceService.test.ts
│   └── handlers/
│       └── VoiceStateHandler.test.ts
└── integration/            # Testes de integração (futuro)
```

## 📋 Cenários de Teste

Veja [TEST_SCENARIOS.md](../TEST_SCENARIOS.md) para a lista completa de cenários de teste documentados.

### 🔴 Cenários Críticos Implementados (P0)

- ✅ **Cenário 1**: Acordar e ir para casinha
- ✅ **Cenário 3**: Iniciar modo de seguir
- ✅ **Cenário 7**: Voltar para casinha quando sozinho
- ✅ **Cenário 8**: Não voltar se há pessoas
- ✅ **Cenário 9**: Dormir quando servidor vazio
- ✅ **Cenário 14**: Parar de seguir ao voltar
- ✅ **Cenário 18**: Detectar se bot está sozinho
- ✅ **Cenário 19**: Detectar usuários no servidor

### 🟡 Próximos a Implementar (P1)

- ⏳ **Cenário 2**: Bot já conectado
- ⏳ **Cenário 4**: Não sair da casinha
- ⏳ **Cenário 5**: Seguir usuário entre canais
- ⏳ **Cenário 10**: Tocar áudio de entrada
- ⏳ **Cenário 11**: Não reiniciar ciclo de latidos

## 📊 Cobertura de Código

Meta de cobertura: **85%** global

Após executar `npm run test:coverage`, veja o relatório em:
```
coverage/index.html
```

## 🎯 Convenções de Teste

### Estrutura de Testes

Usamos o padrão **Given-When-Then** (GWT):

```typescript
it('deve fazer X quando Y', () => {
  // Given: Estado inicial
  const setup = createTestSetup()

  // When: Ação executada
  voiceService.someMethod()

  // Then: Resultado esperado
  expect(result).toBe(expected)
})
```

### Nomenclatura

- **describe**: Nome do módulo/classe sendo testado
- **it/test**: Descrição clara do comportamento esperado
- Use nomes descritivos que expliquem O QUE está sendo testado

### Mocks

- Use os mocks fornecidos em `fixtures/`
- Limpe mocks entre testes com `jest.clearAllMocks()`
- Resete conexões com `mockVoiceModule.clearConnections()`

## 🔧 Debugging

Para debugar testes no VS Code, use:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

## 📝 Adicionando Novos Testes

1. Verifique se o cenário está documentado em [TEST_SCENARIOS.md](../TEST_SCENARIOS.md)
2. Crie o arquivo de teste em `tests/unit/` ou `tests/integration/`
3. Use os mocks existentes em `fixtures/`
4. Siga o padrão Given-When-Then
5. Execute `npm test` para verificar
6. Execute `npm run test:coverage` para verificar cobertura

## 🐛 Problemas Comuns

### Testes falhando com "Cannot find module"

```bash
npm install
```

### Erro de timeout

Aumente o timeout no teste:
```typescript
jest.setTimeout(10000) // 10 segundos
```

### Mocks não sendo limpos

Adicione no `beforeEach`:
```typescript
beforeEach(() => {
  jest.clearAllMocks()
  mockVoiceModule.clearConnections()
})
```
