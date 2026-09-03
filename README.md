# Nova Stream

# PROMPT — SISTEMA COMPLETO DE IPTV / STREAMING COM LANDING PAGE + PAINEL ADMINISTRATIVO + PIXGO + WHATSAPP

Desenvolva um sistema completo, moderno, responsivo e preparado para produção para comercialização de planos de acesso a um serviço de IPTV/streaming de conteúdo devidamente licenciado.

O projeto deverá possuir:

* Landing Page pública

* Painel Administrativo

* Backend/API

* Banco de dados

* Integração completa com PixGo

* Webhooks para confirmação automática dos pagamentos

* Integração com WhatsApp

* Gerenciamento de planos

* Gerenciamento de clientes

* Gerenciamento de pedidos

* Gerenciamento dos pagamentos

* Gerenciamento completo do conteúdo exibido na Landing Page

* Dashboard administrativo

* Configurações gerais do sistema

O painel administrativo deve controlar praticamente todo o conteúdo da Landing Page sem necessidade de alterar código.

---

# 1. STACK DO PROJETO

Preferencialmente utilizar:

Frontend:

Next.js com TypeScript

Framework:

Next.js App Router

Estilização:

Tailwind CSS

Componentes:

shadcn/ui

Ícones:

Lucide Icons

Banco de dados e backend:

Supabase

Banco:

PostgreSQL

Autenticação:

Supabase Auth

Hospedagem Frontend:

Vercel

Backend/Banco:

Supabase

Integração de pagamento:

PixGo API

Documentação:

https://pixgo.org/api/v1/docs

O projeto deverá estar totalmente preparado para deploy na Vercel integrado ao Supabase.

---

# 2. ARQUITETURA

Estruturar o sistema aproximadamente em:

/app

/(site)

/admin

/api

/components

/lib

/services

/hooks

/types

Criar separação clara entre:

Landing Page

Painel administrativo

API

Serviços

Integrações externas

Banco de dados

Autenticação

Nunca colocar chaves privadas diretamente no frontend.

Usar variáveis de ambiente:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

PIXGO_API_KEY

PIXGO_WEBHOOK_SECRET

PIXGO_BASE_URL=https://pixgo.org/api/v1

NEXT_PUBLIC_SITE_URL

Todos os acessos à PixGo deverão acontecer exclusivamente pelo backend.

Nunca expor:

PIXGO_API_KEY

PIXGO_WEBHOOK_SECRET

SUPABASE_SERVICE_ROLE_KEY

para o navegador.

---

# 3. IDENTIDADE VISUAL

Criar uma Landing Page inspirada na experiência visual de plataformas premium de streaming.

A inspiração poderá lembrar Netflix em organização e experiência, mas NÃO copiar diretamente marca, logotipo, textos, código, elementos proprietários ou identidade visual da Netflix.

Criar identidade própria.

Tema predominante:

Background:

#080808

Cards:

#141414

Background secundário:

#101010

Texto:

#FFFFFF

Texto secundário:

#B3B3B3

Cor principal configurável pelo painel.

Por padrão poderá utilizar:

#E50914

Mas essa cor deverá poder ser alterada nas configurações administrativas.

Visual:

premium

cinematográfico

minimalista

moderno

escuro

elegante

Utilizar:

gradientes

overlays

cards

banners cinematográficos

animações discretas

hover elegante

carrosséis horizontais

skeleton loading

transições suaves

---

# 4. HEADER

Criar header moderno contendo:

Logo

Início

Catálogo

Planos

Como funciona

Dúvidas

Contato

Botão:

"ASSINAR AGORA"

O header deverá ficar transparente inicialmente e receber fundo escuro quando o usuário realizar scroll.

Menu mobile responsivo.

Todas as opções devem ser configuráveis através do painel administrativo.

---

# 5. HERO BANNER

Criar um grande banner cinematográfico ocupando boa parte da primeira tela.

O administrador deverá poder cadastrar:

Imagem desktop

Imagem mobile

Título

Subtítulo

Descrição

Texto do botão

Link do botão

Ordem

Status ativo/inativo

Permitir vários banners.

O sistema deverá criar um slider automático.

Exemplo:

Entretenimento sem limites

Filmes, séries, esportes e muito mais em um só lugar.

[CONHECER PLANOS]

Adicionar overlay escuro para manter boa legibilidade.

---

# 6. CATÁLOGO VISUAL

Criar seções semelhantes a plataformas modernas de streaming.

Exemplos:

Destaques

Filmes

Séries

Esportes

Infantil

Documentários

Lançamentos

Mais assistidos

Conteúdo Premium

Cada categoria deverá ser administrada pelo painel.

Cada item poderá possuir:

Título

Imagem horizontal

Imagem vertical

Banner

Descrição

Categoria

Tags

Ano

Classificação

Ordem

Destaque

Status

IMPORTANTE:

Este catálogo tem finalidade promocional.

Não implementar download automático, scraping, captura ou redistribuição não autorizada de streams, canais, filmes ou séries.

O administrador deverá utilizar somente imagens, informações, mídia e conteúdo que tenha autorização para utilizar.

---

# 7. CARROSSEL DE CONTEÚDO

Criar experiência semelhante a um catálogo de streaming.

Desktop:

cards horizontais ou verticais.

Ao passar o mouse:

aumentar levemente o card

mostrar título

categoria

informações

botão "Ver planos"

No mobile:

scroll horizontal por touch.

Implementar lazy loading para imagens.

---

# 8. SEÇÃO DE DISPOSITIVOS

Criar uma seção:

"Assista onde quiser"

Mostrar:

Smart TV

TV Box

Fire TV

Android

iPhone

iPad

Computador

Tablet

Os dispositivos deverão ser configuráveis pelo painel.

Cada dispositivo poderá possuir:

Nome

Ícone

Descrição

Ordem

Status

---

# 9. SEÇÃO DE BENEFÍCIOS

Exemplo:

Qualidade HD / Full HD / 4K

Acesso rápido

Diversos dispositivos

Conteúdo atualizado

Atendimento pelo WhatsApp

Pagamento via PIX

Ativação rápida

Todos deverão ser administráveis.

---

# 10. GERENCIAMENTO DE PLANOS

Criar uma tabela:

plans

Campos:

id

name

slug

description

short_description

price

promotional_price

duration_days

duration_label

devices

quality

features

badge

highlighted

button_text

payment_enabled

whatsapp_enabled

active

position

created_at

updated_at

Exemplos:

Plano Mensal

R$ 29,90

30 dias

1 dispositivo

Plano Trimestral

R$ 69,90

90 dias

2 dispositivos

Plano Semestral

R$ 119,90

180 dias

2 dispositivos

Plano Anual

R$ 199,90

365 dias

3 dispositivos

Esses valores são apenas exemplos.

Nenhum plano deverá ficar fixo no código.

Tudo deverá vir do banco.

O administrador poderá:

Adicionar plano

Editar plano

Excluir plano

Duplicar plano

Ativar plano

Desativar plano

Reordenar planos

Definir destaque

Adicionar selo

Alterar valor

Alterar descrição

Alterar quantidade de dispositivos

Alterar duração

Adicionar benefícios

A Landing Page deverá refletir essas alterações automaticamente.

---

# 11. CARD DOS PLANOS

Cada plano deverá mostrar:

Nome

Valor

Valor promocional

Duração

Quantidade de dispositivos

Qualidade

Benefícios

Selo

Botão

Exemplo:

PLANO ANUAL

R$ 199,90

12 meses

✓ Full HD / 4K

✓ Smart TV

✓ Smartphone

✓ TV Box

✓ Computador

✓ Suporte

[ASSINAR AGORA]

Plano destacado deverá possuir visual diferenciado.

---

# 12. ESCOLHA DA FORMA DE CONTRATAÇÃO

Ao clicar em:

"ASSINAR AGORA"

abrir um modal moderno.

Mostrar:

Plano selecionado

Valor

Duração

Benefícios

Depois perguntar:

"Como deseja contratar?"

Exibir duas opções:

PAGAR COM PIX

FALAR NO WHATSAPP

---

# 13. WHATSAPP

Caso escolha WhatsApp:

abrir automaticamente uma conversa para o número configurado no painel.

Gerar mensagem automaticamente.

Exemplo:

Olá! 👋

Gostaria de contratar o plano:

Plano: {{plan_name}}

Valor: {{plan_price}}

Duração: {{plan_duration}}

Poderia me ajudar com a contratação?

O administrador deverá conseguir configurar:

Número

Mensagem padrão

Texto do botão

Ativar/desativar WhatsApp

Criar URL utilizando:

https://wa.me/

Codificar corretamente a mensagem usando URL encoding.

---

# 14. CHECKOUT PIX

Caso escolha PIX:

abrir página:

/checkout/[plan_slug]

Criar checkout moderno e minimalista.

Mostrar:

Logo

Plano

Valor

Duração

Resumo

Benefícios

Solicitar:

Nome completo

CPF/CNPJ

E-mail

Telefone

CPF/CNPJ deverá ser obrigatório.

Aplicar máscara visual, mas enviar somente números para a API.

Validar CPF/CNPJ antes da requisição.

Exibir checkbox:

"Li e concordo com os Termos de Uso e Política de Privacidade."

Botão:

"GERAR PIX"

---

# 15. INTEGRAÇÃO PIXGO

Utilizar a API oficial PixGo:

Base URL:

https://pixgo.org/api/v1

Autenticação:

X-API-Key

A API Key deverá existir apenas no servidor.

Para criar pagamento utilizar:

POST

/api/v1/payment/create

Criar a cobrança utilizando os dados atuais exigidos pela documentação oficial.

Enviar aproximadamente:

amount

description

receiver_name

receiver_cpf

receiver_email

receiver_phone

external_id

webhook_url

O backend deve consultar a documentação oficial antes da implementação final para garantir que os nomes dos campos continuam atuais.

O external_id deverá representar o pedido interno.

Exemplo:

IPTV-ORDER-UUID

Nunca confiar no valor enviado pelo navegador.

O backend deverá consultar o plano no banco através do ID ou slug e obter novamente o preço antes de enviar a cobrança para a PixGo.

O usuário NÃO poderá modificar o valor do pagamento utilizando DevTools.

---

# 16. RETORNO DO PIX

Após criar pagamento, salvar no banco:

payment_id

external_id

plan_id

customer_id

amount

status

qr_code

qr_image_url

expires_at

provider

created_at

Provider:

pixgo

Mostrar página:

/checkout/pix/[order_id]

Exibir:

QR Code

Código PIX copia e cola

Valor

Plano

Tempo restante

Status

Adicionar botão:

"COPIAR PIX"

Ao clicar:

copiar qr_code

Mostrar:

"PIX copiado com sucesso."

---

# 17. STATUS DO PAGAMENTO

Criar estados visuais:

Aguardando pagamento

Pagamento confirmado

PIX expirado

Pagamento cancelado

Pagamento reembolsado

Enquanto estiver aguardando:

mostrar animação discreta:

"Aguardando confirmação do pagamento..."

Não realizar polling agressivo.

A confirmação principal deverá ocorrer através de webhook.

Se necessário, utilizar consulta periódica controlada como fallback.

---

# 18. WEBHOOK PIXGO

Criar endpoint:

POST

/api/webhooks/pixgo

O endpoint deverá trabalhar com o RAW BODY da requisição.

Verificar:

X-Webhook-Timestamp

X-Webhook-Signature

Utilizar:

PIXGO_WEBHOOK_SECRET

Realizar validação HMAC-SHA256.

Payload utilizado para assinatura:

timestamp + "." + raw_body

Usar comparação timing-safe.

Também rejeitar webhooks antigos para reduzir risco de replay attack.

Nunca processar webhook com assinatura inválida.

---

# 19. EVENTOS PIXGO

Processar:

payment.completed

payment.expired

payment.refunded

Para:

payment.completed

Atualizar pedido:

paid

Atualizar pagamento:

completed

Registrar:

completed_at

Para:

payment.expired

Atualizar:

expired

Para:

payment.refunded

Atualizar:

refunded

O processamento deverá ser idempotente.

Receber o mesmo webhook duas vezes não poderá duplicar pedido, assinatura ou qualquer ação.

Utilizar:

payment_id

external_id

para identificar a transação.

---

# 20. SEGURANÇA ADICIONAL DO PAGAMENTO

Após webhook "payment.completed", opcionalmente confirmar também diretamente na API:

GET

/api/v1/payment/{id}/status

Somente considerar pagamento válido se:

status = completed

O sistema jamais deverá confiar apenas em informações enviadas pelo navegador.

---

# 21. PEDIDOS

Criar tabela:

orders

Campos:

id

order_number

plan_id

customer_id

subtotal

discount

total

payment_method

payment_provider

payment_id

status

source

created_at

paid_at

expired_at

updated_at

Status possíveis:

pending

awaiting_payment

paid

processing

completed

cancelled

expired

refunded

---

# 22. CLIENTES

Tabela:

customers

Campos:

id

name

email

cpf

phone

whatsapp

status

notes

created_at

updated_at

No painel permitir:

Visualizar clientes

Pesquisar

Filtrar

Editar

Adicionar observação

Ver pedidos

Ver pagamentos

Ver plano comprado

Não exibir documentos completos desnecessariamente no painel.

Aplicar boas práticas de proteção de dados.

---

# 23. PAINEL ADMINISTRATIVO

Criar:

/admin

O painel deverá exigir autenticação.

Layout moderno semelhante a:

Stripe Dashboard

Vercel

Linear

Menu lateral.

Itens:

Dashboard

Pedidos

Clientes

Planos

Catálogo

Categorias

Banners

Benefícios

Dispositivos

Depoimentos

Cupons

FAQ

Pagamentos

Landing Page

WhatsApp

Integrações

Configurações

---

# 24. DASHBOARD

Mostrar cards:

Vendas hoje

Vendas no mês

Receita hoje

Receita no mês

Pedidos pendentes

Pagamentos confirmados

Clientes

Ticket médio

Criar gráfico:

Receita dos últimos 30 dias

Outro gráfico:

Vendas por plano

Mostrar tabela:

Últimas vendas

Campos:

Cliente

Plano

Valor

Pagamento

Status

Data

---

# 25. GERENCIADOR DA LANDING PAGE

Criar uma seção:

"Landing Page"

O administrador deverá controlar:

Logo

Favicon

Nome do site

Título SEO

Descrição SEO

Cor principal

Header

Hero banners

Categorias

Conteúdos

Benefícios

Planos

Dispositivos

Depoimentos

FAQ

WhatsApp

Rodapé

Redes sociais

Textos

Botões

Todas as alterações deverão aparecer automaticamente na Landing Page.

---

# 26. BANNERS

Tabela:

banners

Campos:

id

title

subtitle

description

desktop_image

mobile_image

button_text

button_url

position

active

created_at

Criar upload de imagens usando Supabase Storage.

---

# 27. CATÁLOGO

Criar tabelas:

catalog_categories

e

catalog_items

catalog_categories:

id

name

slug

description

position

active

catalog_items:

id

category_id

title

description

poster_url

backdrop_url

year

rating

tags

featured

position

active

created_at

Criar CRUD completo.

---

# 28. FAQ

Criar tabela:

faqs

Campos:

id

question

answer

position

active

Criar accordion elegante na Landing Page.

---

# 29. DEPOIMENTOS

Tabela:

testimonials

Campos:

id

name

text

avatar

rating

position

active

Criar carrossel na Landing Page.

---

# 30. CUPONS

Criar sistema de cupons.

Tabela:

coupons

Campos:

id

code

type

value

minimum_amount

maximum_uses

uses

starts_at

expires_at

active

Tipos:

percentage

fixed

Exemplo:

BEMVINDO10

10% de desconto.

O desconto deverá ser calculado obrigatoriamente pelo backend.

Nunca confiar no valor calculado no frontend.

---

# 31. CONFIGURAÇÕES DO WHATSAPP

Criar página:

Admin > WhatsApp

Campos:

Número

Mensagem padrão

Texto botão

Ativar/desativar

Mensagem pós-pagamento

Variáveis permitidas:

{{customer_name}}

{{plan_name}}

{{plan_price}}

{{order_number}}

Criar preview da mensagem.

---

# 32. CONFIGURAÇÕES PIXGO

Criar:

Admin > Integrações > PixGo

Mostrar:

Status da integração

Nunca mostrar a API Key inteira.

Mostrar apenas:

pk_************abcd

Permitir testar integração através do backend.

Exibir:

PixGo conectado

ou

Erro de configuração PixGo

Nunca enviar API Key para o frontend.

---

# 33. PAGAMENTOS

Criar página:

Admin > Pagamentos

Tabela:

Pedido

Cliente

Plano

Payment ID

Valor

Status

Data

Filtros:

Hoje

Últimos 7 dias

Últimos 30 dias

Período personalizado

Status:

Pending

Completed

Expired

Refunded

Permitir abrir detalhes.

---

# 34. LOG DE WEBHOOKS

Criar tabela:

webhook_logs

Campos:

id

provider

event

payment_id

external_id

payload

signature_valid

processed

processing_error

received_at

Nunca armazenar segredos.

Permitir visualizar esses logs no painel para diagnóstico.

---

# 35. LOG DE AUDITORIA

Criar:

audit_logs

Campos:

id

admin_id

action

entity

entity_id

old_values

new_values

ip_address

created_at

Registrar operações administrativas importantes.

Exemplo:

Plano alterado

Valor alterado

Plano excluído

Configuração alterada

---

# 36. CONFIGURAÇÕES GERAIS

Criar tabela:

settings

ou sistema chave/valor.

Permitir configurar:

Nome da empresa

Logo

Favicon

Cor principal

Telefone

WhatsApp

E-mail

Instagram

Facebook

TikTok

SEO

Google Analytics

Meta Pixel

Scripts adicionais autorizados

---

# 37. SEO

Implementar:

Metadata Next.js

Open Graph

Twitter Cards

Canonical URLs

Sitemap

robots.txt

Schema.org quando aplicável.

Landing Page deverá possuir bom desempenho no Google Lighthouse.

---

# 38. RESPONSIVIDADE

Todo o sistema deverá funcionar perfeitamente:

Desktop

Notebook

Tablet

Smartphone

O mobile deverá receber atenção especial.

Cards do catálogo devem possuir scroll horizontal natural.

Checkout PIX precisa funcionar perfeitamente no celular.

---

# 39. PERFORMANCE

Implementar:

Next/Image

Lazy loading

Image optimization

Server Components quando adequado

Cache inteligente

Queries otimizadas

Indexes PostgreSQL

Evitar carregar todo catálogo simultaneamente.

---

# 40. SEGURANÇA

Implementar:

Supabase Row Level Security

Rotas administrativas protegidas.

Não confiar em permissões apenas no frontend.

Criar papel:

admin

Somente administradores poderão acessar:

/admin

Proteger APIs administrativas.

Adicionar:

Rate limiting

para endpoints críticos.

Especialmente:

checkout

criação de pagamento

login

webhook

Validar entrada com:

Zod

Sanitizar dados.

Utilizar CSP e headers de segurança adequados.

---

# 41. PRIVACIDADE

Como o checkout recebe CPF/CNPJ e dados pessoais:

implementar boas práticas de proteção de dados.

Não registrar CPF/CNPJ em logs comuns.

Não mostrar documento completo em telas administrativas quando desnecessário.

Aplicar mascaramento.

Criar:

Política de Privacidade

Termos de Uso

---

# 42. EXPERIÊNCIA APÓS PAGAMENTO

Quando o webhook confirmar:

payment.completed

a página do cliente deverá mudar automaticamente para:

"PAGAMENTO CONFIRMADO"

Mostrar animação elegante.

Exemplo:

✓ Pagamento confirmado!

Recebemos seu pagamento.

Pedido:

#IPTV-12345

Plano:

Plano Anual

Mostrar:

[FALAR COM ATENDIMENTO]

O WhatsApp poderá receber mensagem automática preparada:

Olá, realizei o pagamento do pedido {{order_number}} referente ao plano {{plan_name}}.

---

# 43. PÁGINA DE SUCESSO

Criar:

/pedido/[order_id]/sucesso

Mostrar:

Pedido

Plano

Valor

Status

Data

Próximas instruções

Nunca disponibilizar credenciais ou acessos antes da confirmação real do pagamento.

---

# 44. ESTADOS DE CARREGAMENTO

Criar skeletons para:

Planos

Catálogo

Dashboard

Pedidos

Clientes

Utilizar toast notifications para:

Salvo com sucesso

Plano criado

Erro ao salvar

Pagamento confirmado

PIX copiado

---

# 45. BANCO DE DADOS

Criar migrations SQL completas para:

profiles

customers

plans

orders

payments

coupons

banners

catalog_categories

catalog_items

benefits

devices

testimonials

faqs

settings

webhook_logs

audit_logs

Criar:

foreign keys

indexes

constraints

timestamps

Utilizar UUID como identificadores principais.

---

# 46. REALTIME

Utilizar Supabase Realtime quando adequado.

Especialmente para atualizar a tela de pagamento.

Quando webhook alterar:

payment.status

para:

completed

o frontend deverá atualizar automaticamente.

Assim o cliente poderá ver:

"Pagamento confirmado"

sem atualizar manualmente a página.

---

# 47. FLUXO COMPLETO

Fluxo esperado:

VISITANTE

↓

LANDING PAGE

↓

ESCOLHE PLANO

↓

MODAL

↓

ESCOLHE:

PIX ou WHATSAPP

Caso WhatsApp:

↓

Abre WhatsApp com plano e valor preenchidos.

Caso PIX:

↓

CHECKOUT

↓

Preenche dados

↓

BACKEND BUSCA PLANO NO BANCO

↓

CRIA PEDIDO

↓

BACKEND ENVIA COBRANÇA PARA PIXGO

↓

PIXGO RETORNA QR CODE

↓

SISTEMA SALVA PAGAMENTO

↓

CLIENTE VISUALIZA QR CODE

↓

CLIENTE PAGA

↓

PIXGO ENVIA WEBHOOK

↓

BACKEND VALIDA ASSINATURA

↓

BACKEND CONFIRMA PAGAMENTO

↓

PEDIDO = PAID

↓

REALTIME ATUALIZA CHECKOUT

↓

CLIENTE VÊ:

PAGAMENTO CONFIRMADO

↓

CLIENTE RECEBE PRÓXIMAS INSTRUÇÕES.

---

# 48. LANDING PAGE FINAL

A estrutura da página deverá aproximadamente ser:

HEADER

↓

HERO CINEMATOGRÁFICO

↓

DESTAQUES

↓

FILMES

↓

SÉRIES

↓

ESPORTES

↓

CONTEÚDO PREMIUM

↓

BENEFÍCIOS

↓

DISPOSITIVOS

↓

PLANOS

↓

COMO FUNCIONA

↓

DEPOIMENTOS

↓

FAQ

↓

CTA

↓

FOOTER

Adicionar botão flutuante do WhatsApp.

---

# 49. DIFERENCIAL VISUAL

Quero que a Landing Page cause impacto visual.

Adicionar:

banners grandes

cards cinematográficos

efeitos hover

scroll suave

gradientes

backgrounds com blur

animações discretas

transições

carrosséis

Mas manter excelente performance.

Evitar exagero em animações.

---

# 50. NÃO UTILIZAR CONTEÚDO MOCK NO RESULTADO FINAL

Os componentes poderão inicialmente utilizar seed de demonstração durante desenvolvimento.

Porém, na versão final:

planos

banners

catálogo

benefícios

FAQ

depoimentos

configurações

deverão obrigatoriamente ser carregados do Supabase.

Alterações realizadas no painel devem aparecer automaticamente na Landing Page.

---

# 51. QUALIDADE DO CÓDIGO

Utilizar:

TypeScript estrito

Evitar:

any

Criar:

interfaces

types

schemas Zod

services

repositories quando necessário

Componentizar corretamente.

Não criar componentes gigantes.

Seguir boas práticas do Next.js.

---

# 52. DOCUMENTAÇÃO

Criar arquivo:

README.md

Explicando:

Instalação

Variáveis de ambiente

Configuração Supabase

Configuração PixGo

Webhook

Deploy Vercel

Migrations

Criação do primeiro administrador

Criar:

.env.example

Sem nenhuma credencial verdadeira.

---

# 53. PIXGO — REGRAS IMPORTANTES

Seguir sempre a documentação oficial mais recente:

https://pixgo.org/api/v1/docs

Implementar corretamente:

X-API-Key

Webhook Secret

Assinatura HMAC-SHA256

X-Webhook-Timestamp

X-Webhook-Signature

CPF/CNPJ obrigatório

external_id

payment_id

status

QR Code

PIX copia e cola

Nunca expor credenciais no frontend.

Não assumir que um pagamento foi concluído apenas porque o usuário voltou para o site.

Somente considerar pagamento confirmado após resposta confiável da API/webhook.

---

# 54. ADMINISTRADOR DEVE CONTROLAR A LANDING PAGE

Essa é uma regra fundamental do projeto.

O painel administrativo deverá funcionar como um CMS.

Exemplo:

Administrador altera:

Plano Anual

R$199,90

para:

Plano Premium

R$179,90

Ao salvar:

a Landing Page deverá mostrar imediatamente:

Plano Premium

R$179,90

sem alterar código.

O mesmo deverá acontecer com:

banners

textos

imagens

FAQ

depoimentos

benefícios

WhatsApp

cores

catálogo

SEO

---

# 55. RESULTADO ESPERADO

Entregar um sistema completo, com aparência profissional e pronto para produção.

Não criar apenas telas estáticas.

Landing Page, painel administrativo, banco, API e PixGo deverão funcionar integrados de verdade.

Antes de considerar uma funcionalidade concluída:

validar a persistência no banco

validar permissões

validar atualização na Landing Page

validar versão desktop

validar versão mobile

validar erros de API

validar estados vazios

validar loading

validar segurança

O resultado visual deve transmitir a sensação de uma plataforma premium de entretenimento, com interface cinematográfica e experiência semelhante aos grandes serviços de streaming, porém mantendo identidade própria.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/155a320d-6a30-44ad-b2af-6c273f688a1e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
