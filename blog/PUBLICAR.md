# Como publicar um artigo no blog

Fluxo escolhido: **a Iza escreve, eu (assistente) publico.** O site é estático
(GitHub Pages), então cada artigo é uma página em `/blog/<slug>.html`, gerada a
partir de [`modelo-artigo.html`](modelo-artigo.html).

## 1. O que a Iza manda (por e-mail/WhatsApp/Docs)

- **Título** do artigo.
- **Área:** "Família internacional" ou "Direito médico".
- **Linha de abertura / resumo** (1–2 frases) — vira o subtítulo e a meta description.
- **Texto completo**, já **validado por ela (OAB)**. Pode mandar em Word/Docs/texto puro,
  com a estrutura que quiser (subtítulos, listas, destaques).
- **Data** de publicação.

> Regras de marca na escrita (valem para todo artigo):
> - **Sem em-dash** (`—`). Use vírgula, ponto, dois-pontos ou parênteses.
> - **Sem promessa de êxito** ("ganho a causa", "100%") — restrição da OAB.
> - **Termo técnico sempre com tradução** ao lado ("homologação", ou seja, fazer valer...).
> - Tom Sábia + Cuidadora: claro, acolhedor, sóbrio.

## 2. O que eu faço para publicar (passo a passo)

1. Copio `modelo-artigo.html` para `/blog/<slug>.html`.
   - **slug** = título em minúsculas, sem acento, com hífens.
     Ex.: `Como casar com estrangeiro no Brasil?` → `como-casar-com-estrangeiro-no-brasil`
2. Preencho tudo entre `{{ }}` (título, resumo, data, área, tempo de leitura, corpo).
3. Converto o texto da Iza para HTML simples: `<h2>`, `<h3>`, `<p>`, `<ul>/<ol>`,
   `<strong>`, `<blockquote>`.
4. **Removo** a linha `<meta name="robots" content="noindex" />` (só o modelo é noindex).
5. Adiciono a URL nova ao `../sitemap.xml`.
6. Na home (`../index.html`), transformo o card do tema correspondente em **link**
   (troco o "Em breve" por `<a href="blog/<slug>.html">`).
7. Faço commit + push → o GitHub Pages publica em 1–2 min.

## 3. Temas-semente já previstos na home

(viram artigos conforme a Iza escreve)

- Como casar com estrangeiro no Brasil? — *Família internacional*
- Como obter residência após o casamento? — *Família internacional*
- O plano de saúde negou meu tratamento. E agora? — *Direito médico*
- Como conseguir home care pela Justiça? — *Direito médico*
- Divórcio internacional: o que fazer? — *Família internacional*

O conteúdo nasce primeiro no Instagram (@izarossiter); o blog aprofunda os mesmos temas.
