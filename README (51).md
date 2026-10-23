# Aula 04 - Navegadores Web e API

## Materiais da Aula

Nesta pasta você encontra todos os materiais da Aula 04:

- **[Slides](./slide/)** - Apresentação da aula
- **[Briefing](./briefing.md)** - Resumo dos tópicos abordados
- **[Trabalho Final (TF 04)](./04.txt)** - Descrição detalhada do exercício

---

## Trabalho Final 04 - Gerenciador de Tarefas com UPDATE e DELETE

### Objetivo

Implementar as operações faltantes de um gerenciador de tarefas: **atualizar** (marcar como concluída) e **deletar** tarefas.

### O que você precisa fazer

#### 1. Marcar Tarefa como Concluída (UPDATE)
- Adicionar um **checkbox** antes do nome da tarefa
- Ao marcar/desmarcar, chamar a API para atualizar `is_done` no backend
- A tarefa deve aparecer com `strikethrough` quando concluída
- Implementar o handler para fazer a chamada PUT

#### 2. Deletar Tarefa (DELETE)
- Adicionar um **botão "Excluir"** ao lado de cada tarefa
- Confirmar antes de deletar (usar `alert`)
- Chamar a API para remover do backend
- Recarregar a lista automaticamente após deletar

### Arquivos a trabalhar

```
src/frontend/public/js/
├── render/
│   └── taskRender.js          ← Descomente checkbox e botão delete aqui
├── listeners/
│   ├── taskToggleHandler.js   ← Implementar UPDATE (checkbox)
│   └── taskDeleteHandler.js   ← Implementar DELETE (botão)
└── pages/
    └── tasks.js               ← Já carrega tudo, apenas use
```

### APIs disponíveis no backend

```
PUT /users/{idUser}/tasks/{id}
  Body: { is_done: boolean }
  → Marca/desmarca como concluída

DELETE /users/{idUser}/tasks/{id}
  → Deleta a tarefa
```

### Regras

- ✅ Use axios/fetch normalmente
- ✅ Siga o padrão do projeto (js/api, js/listeners)
- ✅ Recarregue a lista após atualizar/deletar
- ✅ Trate erros com mensagens ao usuário
- ❌ Não quebre o listar e criar (que já funcionam)
- ❌ Não pode usar frameworks além do que já existe

### Como entregar

Preencha o formulário com seu código no link abaixo:

🔗 **[LINK DO FORMULÁRIO DE ENTREGA](https://docs.google.com/forms/d/e/1FAIpQLSfQYQpk55_9VKsyME84-QnLjedeBv_KXPD5RHBAZPxwnPnRjQ/viewform?usp=publish-editor)**

**Prazo:** 21/09/2026T23:59:59

---

## Dúvidas?

Revise o [briefing.md](./briefing.md) e os comentários `TODO` no código para entender melhor o que fazer.

Desenvolvido por **Luan Tavares** para UNIFAAT
