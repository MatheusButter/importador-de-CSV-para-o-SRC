# Conversor ODS / XLS para CSV — Sistema SRC (Ifes)

Aplicação web moderna, intuitiva e segura desenvolvida para auxiliar servidores, docentes e extensionistas do **Instituto Federal do Espírito Santo (Ifes)** a converterem, validarem e padronizarem planilhas de discentes/participantes (`.ods`, `.xlsx`, `.xls`) para o padrão estrito aceito pelo **SRC (Sistema de Registro e Emissão de Certificados)**.

Todo o processamento e a sanitização dos dados ocorrem **100% no navegador do usuário (Client-Side)**, garantindo conformidade com a LGPD e privacidade total das informações dos estudantes e participantes.

---

## 🎯 Funcionalidades Principais

- **Ingestão Multi-Formato**: Suporte nativo para planilhas abertas OpenDocument (`.ods` do LibreOffice Calc) e Microsoft Excel (`.xlsx`, `.xls`).
- **Validação e Higienização de CPFs**:
  - Remoção automática de pontuações e traços (`.` e `-`).
  - Preservação do zero à esquerda (CPFs com 11 algarismos).
  - Algoritmo de validação de dígitos verificadores dos CPFs com alertas visuais imediatos.
- **Normalização de Datas**: Formatação padronizada para o formato brasileiro `DD/MM/AAAA`.
- **Mapeamento de 7 Colunas Canônicas**:
  1. `"Nome"`
  2. `"Nascimento"`
  3. `"CPF"`
  4. `"Email"`
  5. `"Carga horária"`
  6. `"Início"`
  7. `"Fim"`
- **Editor de Tabela Interativo**: Permite criar a planilha do zero diretamente no navegador ou editar células individualmente com pré-visualização instantânea.
- **Exportação Padronizada SRC**:
  - Codificação de caracteres **UTF-8** (preservando acentuação gráfica sem quebras).
  - Delimitador tabular (`\t`).
  - Campos envolvidos entre aspas duplas (`"..."`).
  - Fim de linha padrão CRLF/LF compatível.
- **Tutorial Ilustrado Integrado**: Passo a passo de 6 etapas reproduzindo a interface real do SRC/Ifes para orientar o envio do arquivo gerado sem erros.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Processamento de Planilhas**: [SheetJS (xlsx)](https://sheetjs.com/)
- **Ícones**: [Material Symbols](https://fonts.google.com/icons) & [Lucide React](https://lucide.dev/)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (versão 18+ recomendada) ou Bun / Yarn / pnpm.

### Instalação
```bash
# Instalar dependências
npm install
```

### Modo de Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento local (porta 3000)
npm run dev
```
Acesse em seu navegador: `http://localhost:3000`.

### Geração de Build de Produção
```bash
# Gerar os arquivos estáticos otimizados na pasta dist/
npm run build
```

---

## ❓ O projeto suporta ser hospedado no Apache Tomcat 9?

**SIM, com certeza!** O Apache Tomcat 9 pode hospedar este projeto sem qualquer problema.

Como a aplicação é uma **SPA (Single Page Application)** estática em React gerada pelo Vite, ela **não requer um servidor Node.js em tempo de execução** para funcionar. Todo o código JavaScript, HTML e CSS compilado roda no navegador do cliente.

### Como implantar no Apache Tomcat 9:

Existem duas formas fáceis de implantar os arquivos gerados no Tomcat 9:

#### Opção A: Como aplicação em contexto específico (pasta ou arquivo `.war`)
1. No seu ambiente de desenvolvimento, rode o comando de compilação:
   ```bash
   npm run build
   ```
   Isso gerará a pasta `dist/` com todos os arquivos estáticos (`index.html`, `assets/`, etc.).

2. Crie um arquivo `WEB-INF/web.xml` dentro da pasta `dist/` para tratar o roteamento de Single Page Application (garantindo que qualquer requisição redirecione para o `index.html`):
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                                http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
            version="3.1">
       <display-name>Conversor SRC Ifes</display-name>
       <error-page>
           <error-code>404</error-code>
           <location>/index.html</location>
       </error-page>
   </web-app>
   ```

3. **Caso vá rodar em uma subpasta/subcontexto** (por exemplo `http://meu-servidor:8080/conversor-src/` em vez de na raiz), ajuste a propriedade `base` no `vite.config.ts`:
   ```ts
   // vite.config.ts
   export default defineConfig({
     base: '/conversor-src/', // ou './' para caminhos relativos
     // ... demais configurações
   });
   ```

4. Empacote a pasta `dist` como um arquivo `.war` (ou simplesmente copie a pasta para `webapps`):
   ```bash
   cd dist
   jar -cvf conversor-src.war *
   ```

5. Cole o arquivo `conversor-src.war` no diretório `webapps/` do seu Apache Tomcat 9. O Tomcat fará o deploy automático.

#### Opção B: Substituindo a aplicação ROOT do Tomcat
Se você quiser que o conversor abra diretamente na porta principal do Tomcat (ex: `http://meu-servidor:8080/`):
1. Limpe o conteúdo da pasta `webapps/ROOT/` do Tomcat.
2. Copie o conteúdo gerado dentro da pasta `dist/` diretamente para `webapps/ROOT/`.

---

## 🔒 Privacidade e Segurança (LGPD)

- **Processamento 100% Local**: Os arquivos submetidos nunca são enviados para servidores externos. Todo parsing de planilhas e exportação CSV é feito na memória RAM do navegador do próprio usuário.
- **Sem Telemetria**: Não há captura de dados pessoais, CPFs, nomes ou informações cadastrais.

---

## 🏛️ Institucional

- **Destino Oficial**: Portal SRC — [src.ifes.edu.br](https://src.ifes.edu.br)
- **Mantenedor / Uso**: Docentes, Técnicos-Administrativos e Coordenadores de Extensão do Instituto Federal do Espírito Santo (Ifes).
