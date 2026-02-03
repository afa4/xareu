# 🧪 Cenários de Teste - Xaréu Bot

## 📋 Regras de Negócio e Comportamentos

### 🏠 Sistema da Casinha do Xeréu

#### Cenário 1: Acordar e ir para a casinha
- **Dado que** o bot está offline/desconectado
- **E** existe um canal "Casinha do Xeréu" no servidor
- **Quando** o primeiro usuário entra em qualquer canal de voz
- **Então** o bot deve acordar e ir para a "Casinha do Xeréu"
- **E** deve marcar `isInCasinha = true`
- **E** deve marcar `isFollowingUser = false`

#### Cenário 2: Bot já conectado quando usuário entra
- **Dado que** o bot já está conectado em um canal
- **E** está seguindo um usuário
- **Quando** outro usuário entra no servidor
- **Então** o bot deve continuar no canal atual
- **E** não deve ir para a casinha

#### Cenário 3: Iniciar modo de seguir
- **Dado que** o bot está na "Casinha do Xeréu"
- **E** `isInCasinha = true`
- **Quando** um usuário entra na "Casinha do Xeréu"
- **Então** o bot deve marcar `isFollowingUser = true`
- **E** deve tocar o áudio de entrada
- **E** deve começar a seguir esse usuário

#### Cenário 4: Bot não sai da casinha para outros canais
- **Dado que** o bot está na "Casinha do Xeréu"
- **E** `isFollowingUser = false`
- **Quando** um usuário entra em outro canal (não a casinha)
- **Então** o bot deve permanecer na "Casinha do Xeréu"
- **E** deve mostrar mensagem "esperando ser chamado"

### 🐕 Sistema de Seguir Usuário

#### Cenário 5: Seguir usuário entre canais
- **Dado que** o bot está seguindo um usuário (`isFollowingUser = true`)
- **Quando** o usuário muda de canal
- **Então** o bot deve ir para o mesmo canal que o usuário
- **E** deve tocar áudio de entrada
- **E** deve manter `isFollowingUser = true`

#### Cenário 6: Não seguir quando não está em modo de seguir
- **Dado que** o bot está na casinha
- **E** `isFollowingUser = false`
- **Quando** um usuário muda de canal
- **Então** o bot não deve seguir o usuário
- **E** deve permanecer na casinha

### 🚪 Sistema de Saída e Retorno à Casinha

#### Cenário 7: Voltar para casinha quando ficar sozinho
- **Dado que** o bot está em um canal com usuários
- **E** `isFollowingUser = true`
- **Quando** todos os usuários saem do canal
- **E** ainda há pessoas em outros canais do servidor
- **Então** o bot deve voltar para a "Casinha do Xeréu"
- **E** deve marcar `isFollowingUser = false`
- **E** deve marcar `isInCasinha = true`

#### Cenário 8: Não voltar para casinha se ainda há pessoas no canal
- **Dado que** o bot está em um canal com 3 pessoas
- **E** `isFollowingUser = true`
- **Quando** 1 pessoa sai do canal
- **E** ainda restam 2 pessoas (além do bot)
- **Então** o bot deve permanecer no canal
- **E** não deve voltar para a casinha

#### Cenário 9: Dormir quando o servidor fica vazio
- **Dado que** o bot está conectado em qualquer canal
- **Quando** todos os usuários saem do servidor
- **Então** o bot deve desconectar completamente (dormir)
- **E** deve limpar estados `isInCasinha` e `isFollowingUser`
- **E** deve cancelar timers de latidos agendados

### 🔊 Sistema de Áudios

#### Cenário 10: Tocar áudio de entrada
- **Dado que** o bot entra em um canal com usuários
- **Quando** o bot entra no canal
- **Então** deve aguardar 2 segundos (ENTRY_WAIT_TIME_MS)
- **E** deve tocar o áudio de entrada
- **E** deve iniciar ciclo de latidos aleatórios (se não houver um ativo)

#### Cenário 11: Não reiniciar ciclo de latidos ao mudar de canal
- **Dado que** o bot já tem um timer de latidos aleatórios ativo
- **Quando** o bot muda de canal seguindo um usuário
- **Então** deve tocar áudio de entrada
- **E** NÃO deve reiniciar o timer de latidos aleatórios
- **E** deve manter o timer existente

#### Cenário 12: Latidos aleatórios continuam após mudar de canal
- **Dado que** o bot está em um canal com timer de latidos ativo
- **Quando** o bot muda para outro canal
- **Então** os latidos aleatórios devem continuar no novo canal
- **E** deve usar a conexão atual do bot

### 🎛️ Estados e Flags

#### Cenário 13: Resetar estado ao acordar
- **Dado que** o bot foi reiniciado
- **E** já existe uma conexão de voz de sessão anterior
- **Quando** um usuário entra no servidor
- **Então** deve limpar `isFollowingUser = false`
- **E** deve ir para a "Casinha do Xeréu"
- **E** não deve seguir automaticamente

#### Cenário 14: Parar de seguir ao voltar para casinha
- **Dado que** o bot está seguindo um usuário (`isFollowingUser = true`)
- **Quando** o bot volta para a "Casinha do Xeréu"
- **Então** deve marcar `isFollowingUser = false`
- **E** deve mostrar log "parou de seguir"

### 🚫 Comportamento Legado (Sem Casinha)

#### Cenário 15: Modo legado quando não há casinha
- **Dado que** NÃO existe canal "Casinha do Xeréu" no servidor
- **Quando** um usuário entra em qualquer canal
- **Então** o bot deve ir diretamente para o canal do usuário
- **E** deve seguir automaticamente (comportamento antigo)

### ⏱️ Múltiplos Servidores

#### Cenário 16: Isolar estados entre servidores
- **Dado que** o bot está em 2 servidores diferentes
- **E** está seguindo usuário no Servidor A
- **Quando** um usuário sai do Servidor B
- **Então** o bot no Servidor A não deve ser afetado
- **E** deve continuar seguindo normalmente

#### Cenário 17: Verificar canal correto ao sair
- **Dado que** o bot está em um canal no Servidor A
- **Quando** um usuário sai de um canal DIFERENTE do bot
- **Então** o bot não deve voltar para casinha
- **E** deve verificar apenas usuários do mesmo canal

### 🔍 Validações de Detecção

#### Cenário 18: Detectar se bot está sozinho
- **Dado que** o bot está em um canal
- **Quando** verifica se está sozinho
- **Então** deve contar apenas usuários humanos (não-bots)
- **E** deve retornar true se não há humanos no canal

#### Cenário 19: Detectar se há usuários no servidor
- **Dado que** o bot precisa verificar o servidor
- **Quando** verifica se há usuários em voz
- **Então** deve verificar TODOS os canais de voz
- **E** deve contar apenas usuários humanos (não-bots)
- **E** deve retornar true se há pelo menos 1 humano

### 🎯 Edge Cases

#### Cenário 20: Usuário entra e sai rapidamente
- **Dado que** o bot está na casinha
- **Quando** um usuário entra e sai em menos de 2 segundos
- **Então** o bot deve permanecer na casinha
- **E** não deve crashar ou entrar em estado inconsistente

#### Cenário 21: Múltiplas pessoas entrando na casinha simultaneamente
- **Dado que** o bot está na casinha
- **Quando** 2 usuários entram na casinha ao mesmo tempo
- **Então** o bot deve começar a seguir
- **E** deve marcar `isFollowingUser = true` apenas uma vez
- **E** não deve criar múltiplos listeners

#### Cenário 22: Bot movido manualmente para outro canal
- **Dado que** o bot está na casinha
- **Quando** um admin move o bot manualmente para outro canal
- **Então** o bot deve atualizar seu estado corretamente
- **E** não deve voltar automaticamente para a casinha

---

## 📊 Matriz de Prioridade de Testes

### 🔴 Críticos (P0)
- Cenário 1: Acordar e ir para casinha
- Cenário 3: Iniciar modo de seguir
- Cenário 5: Seguir usuário entre canais
- Cenário 7: Voltar para casinha quando sozinho
- Cenário 8: Não voltar se há pessoas
- Cenário 9: Dormir quando servidor vazio

### 🟡 Importantes (P1)
- Cenário 2: Bot já conectado
- Cenário 4: Não sair da casinha
- Cenário 10: Tocar áudio de entrada
- Cenário 11: Não reiniciar ciclo de latidos
- Cenário 13: Resetar estado ao acordar
- Cenário 16: Isolar estados entre servidores

### 🟢 Desejáveis (P2)
- Cenário 15: Modo legado
- Cenário 17: Verificar canal correto
- Cenário 18-19: Validações de detecção
- Cenário 20-22: Edge cases

---

## 🏗️ Estrutura de Testes Sugerida

```
tests/
├── unit/
│   ├── services/
│   │   ├── VoiceService.test.ts          # Testa lógica de conexão e canais
│   │   ├── AudioService.test.ts          # Testa reprodução de áudio
│   │   └── CommandService.test.ts        # Testa comandos
│   ├── handlers/
│   │   ├── VoiceStateHandler.test.ts     # Testa lógica de eventos de voz
│   │   └── MessageHandler.test.ts        # Testa mensagens/comandos
│   └── utils/
│       └── helpers.test.ts               # Testa funções auxiliares
├── integration/
│   └── casinha-flow.test.ts              # Testa fluxo completo da casinha
└── fixtures/
    ├── mockDiscordClient.ts              # Mocks do Discord.js
    ├── mockVoiceConnection.ts            # Mocks de conexão de voz
    └── testData.ts                       # Dados de teste
```

---

## 🎯 Cobertura de Código Esperada

- **VoiceService**: 90%+
- **VoiceStateHandler**: 95%+
- **AudioService**: 80%+
- **Helpers**: 100%
- **Global**: 85%+
