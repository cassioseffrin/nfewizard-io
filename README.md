ORIGINAL:

/**
    * @description      : 
    * @author           : Marco Lima 
    * @group            : 
    * @created          :  
    * 
    * MODIFICATION LOG
    * - Version         : 0.2.6
    * - Date            : 14/11/2024
    * - Author          : Cassio Seffrin
    * - Modification    : 
**/
import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

import path from 'path';
export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/esm/index.js',
                format: 'esm',
                sourcemap: false,
            },
            {
                file: 'dist/cjs/index.cjs',
                format: 'cjs',
                sourcemap: false,
                exports: 'named',
                interop: 'auto',
            },
        ],
        external: ['fs', 'path', 'https', 'url', 'crypto', 'bwip-js', 'xsd-schema-validator', 'pdfkit', 'pem', 'libxmljs'],
        plugins: [
            alias({
                entries: [
                    { find: '@Adapters', replacement: path.resolve(__dirname, 'src/adapters') },
                    { find: '@Modules', replacement: path.resolve(__dirname, 'src/modules') },
                    { find: '@Interfaces', replacement: path.resolve(__dirname, 'src/core/interfaces') },
                    { find: '@Interfaces/*', replacement: path.resolve(__dirname, 'src/core/interfaces/*') },
                    { find: '@Types', replacement: path.resolve(__dirname, 'src/core/types') },
                    { find: '@Types/*', replacement: path.resolve(__dirname, 'src/core/types/*') },
                    { find: '@Core', replacement: path.resolve(__dirname, 'src/core') },
                    { find: '@Core/*', replacement: path.resolve(__dirname, 'src/core/*') },
                    { find: '@Utils/*', replacement: path.resolve(__dirname, 'src/core/utils/*') },
                ],
            }),
            json(),
            nodeResolve(),
            commonjs(),
            typescript({
                tsconfig: "tsconfig.json",
                sourceMap: true,
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                preventAssignment: true,
            }),
            copy({
                targets: [
                    { src: 'src/resources/*', dest: 'dist/resources' },
                ],
            }),
            terser({
                compress: true,
                keep_fnames: true,
                mangle: false,
            }),
        ],
    },
];





<!-- <div style="height: 200px; display: flex; justify-content: center; align-items: center; width: 100%;">
  <img src="./src/assets/logo.jpg" style="height: 200px;width: 200px;" />
</div> -->

# NFeWizard-io

NFeWizard-io é uma biblioteca Node.js projetada para simplificar a interação com os webservices da SEFAZ, proporcionando uma solução robusta para automação de processos relacionados à Nota Fiscal Eletrônica (NF-e). A biblioteca oferece métodos abrangentes para diversas operações fiscais, incluindo:

- **Autorização (Emissão de NFe e NFCe)**: Submissão de Notas Fiscais Eletrônicas e Notas Fiscais de Consumidor Eletrônica
para autorização.
- **Distribuição DFe**: Consulta e Download de DF-e (Documentos fiscais eletrônicos), facilitando o acesso a documentos fiscais eletrônicos.
- **Consulta de Protocolo**: Verificação da situação atual da NF-e na Base de Dados do Portal da Secretaria de Fazenda Estadual.
- **Inutilização de NFe**: Processo de inutilização de números de NF-e que não serão utilizados, assegurando a conformidade fiscal.
- **Consulta de Status do Serviço**: Monitoramento do status dos serviços da SEFAZ, garantindo a disponibilidade dos webservices.
- **Recepção de Eventos**: Tratamento de diversos eventos relacionados à NFe, incluindo:
    - Cancelamento de NFe
    - Carta de Correção
    - Ciência da Operação
    - Confirmação da Operação
    - Desconhecimento da Operação
    - EPEC (Evento Prévio de Emissão em Contingência)
    - Operação Não Realizada
- **Geração de DANFE**: Criação do Documento Auxiliar da Nota Fiscal Eletrônica (DANFE), um resumo impresso da NFe.

## 🚧 ATENÇÃO 🚧

Para ambientes CJS (CommonJS) a importação utilizada deverá ser feita da seguinte maneira:
```typescript
const NFeWizard = require('nfewizard-io').default;
```


## Exemplo de Utilização

```typescript
import NFeWizard from 'nfewizard-io';
// Instanciar
const nfeWizard = new NFeWizard();

// Inicializar
await nfeWizard.NFE_LoadEnvironment({
    config: {
        dfe: {
            baixarXMLDistribuicao: true,
            pathXMLDistribuicao: "tmp/DistribuicaoDFe",
            armazenarXMLAutorizacao: true,
            pathXMLAutorizacao: "tmp/Autorizacao",
            armazenarXMLRetorno: true,
            pathXMLRetorno: "tmp/RequestLogs",
            armazenarXMLConsulta: true,
            pathXMLConsulta: "tmp/RequestLogs",
            armazenarXMLConsultaComTagSoap: false,
            armazenarRetornoEmJSON: true,
            pathRetornoEmJSON: "tmp/DistribuicaoDFe",

            pathCertificado: "certificado.pfx",
            senhaCertificado: "123456",
            UF: "SP",
            CPFCNPJ: "99999999999999",
        },
        nfe: {
            ambiente: 2,
            versaoDF: "4.00",
        },
        email: {
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
                user: 'seu-email@example.com',
                pass: 'sua-senha'
            },
            emailParams: {
                from: '"Seu Nome" <seu-email@example.com>',
                to: 'destinatario@example.com',
            }
        },
        lib: {
            connection: {
                timeout: 30000,
            },
            useOpenSSL: false,
            useForSchemaValidation: 'validateSchemaJsBased',
        }
    }
});

// Exemplo de Utilização
const chaveNFe: DFePorChaveNFe = {
    cUFAutor: 35,
    CNPJ: '99999999999999',
    consChNFe: {
        chNFe: '00000000000000000000000000000000000000000000'
    },
}

await nfeWizard.NFE_DistribuicaoDFePorChave(chaveNFe);
```

## Documentação

- Para a documentação completa acesse [NFeWizard-io - Docs](https://nfewizard-org.github.io/)
  

## Última Release (0.3.1)

- Efetuados diversos ajustes na emissão de NFC-e.
- Alterada estrutura de pastas da lib (com mais alterações estruturais por vir)

## Observações

- `Certificado`: Implementado apenas em certificados A1.
- `NodeJs`: Testado com versões 16 ou superiores.
- `UF`: Testado apenas para São Paulo. Por favor, abra uma issue caso encontre problemas com outros estados.

**Para uma boa experiência de Debug no VS Code permitindo fazer o "step into" nos métodos do NfeWizzard, usar o launch.json com sourceMpas true e outFiles conforme segue:**:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/src/index.ts",
            "outFiles": [
                "${workspaceFolder}/**/*.js"
            ],
            "sourceMaps": true
        }
    ]
}
```

**Exemplo do tsconfig.json do projeto que importa o NFEWizard.IO:**:
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "nodenext",
    "outDir": "dist", 
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "inlineSources": true,
    "inlineSourceMap": false,
    "declaration": true,
    "declarationMap": true,
    "moduleResolution": "nodenext"
  }
}
```

## Em Desenvolvimento

### Próximos passos

- Adicionar tratamento de LOGs
- Estudo para implementação de NFSe

## Contribua para Nossa Biblioteca Open Source

Primeiramente, obrigado por considerar contribuir para nossa biblioteca! Nosso projeto é de código aberto e gratuito para uso, mas manter e desenvolver novas funcionalidades requer tempo e esforço. Se você achar nosso trabalho útil e quiser apoiar nosso desenvolvimento, considere fazer uma doação.

## Por que doar?

- **Suporte Contínuo**: Sua doação ajuda a manter o projeto ativo e em constante evolução.
- **Novos Recursos**: Com seu apoio, podemos adicionar novos recursos e melhorias.
- **Manutenção e Correções**: Garantimos que bugs sejam corrigidos rapidamente e que o código esteja sempre atualizado.
- **Reconhecimento**: Apoiadores são reconhecidos em nossa documentação e página do projeto.
- **Fraldas**: Meu primeiro filho nasceu no inicio desse ano, fraldas são caras! 🍼🚼

## Como doar?

Você pode contribuir através das seguintes plataformas:

- [GitHub Sponsors](https://github.com/sponsors/Maurelima?frequency=recurring&sponsor=Maurelima)
- **Pix**: Se preferir doar via Pix, utilize a seguinte chave:

    ```
    Chave Pix: 944ce2f2-e90f-400a-a388-bb1fe6719e02
    Nome: Marco Lima
    ```

Agradecemos imensamente seu apoio!

## Outras formas de contribuir

Se você não puder doar financeiramente, existem outras maneiras valiosas de contribuir:

- **Reportar Bugs**: Envie relatórios de bugs e problemas que encontrar.
- **Submeter PRs**: Contribua com código, documentação ou testes.
- **Espalhe a Palavra**: Compartilhe nosso projeto com amigos e colegas.

## Agradecimentos

Agradecemos imensamente seu apoio e contribuição. Juntos, podemos construir e manter uma ferramenta incrível para todos!

**Muito obrigado!**


# Contribuidores

## Contribuidores de Código

Agradecemos aos seguintes desenvolvedores por suas contribuições ao projeto:

<table>
  <tr>
    <td align="center"><a href="https://github.com/dliocode"><img src="https://github.com/dliocode.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>dliocode</b></sub></a></td>
    <td align="center"><a href="https://github.com/ThalesAugusto0"><img src="https://github.com/ThalesAugusto0.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>ThalesAugusto0</b></sub></a></td>
    <td align="center"><a href="https://github.com/cassioseffrin"><img src="https://github.com/cassioseffrin.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>cassioseffrin</b></sub></a></td>
  </tr>
</table>

## Patrocínios

Agradecemos imensamente aos nossos patrocinadores pela sua generosidade.

### Contribuições

<table>
  <tr>
    <td align="center"><a href="https://github.com/italosll"><img src="https://github.com/italosll.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>italosll</b></sub></a></td>
    <!-- Adicione mais contribuidores conforme necessário -->
  </tr>
</table>

### Contribuições Mensais

<table>
  <tr>
    <!-- <td align="center"><a href="https://github.com/user5"><img src="https://github.com/user5.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>User5</b></sub></a></td> -->
    <!-- Adicione mais contribuidores conforme necessário -->
  </tr>
</table>

## Criadores

| [<img src="https://avatars.githubusercontent.com/u/59918400?s=400&u=3554ebcf0f75263637516867945ebd371e68da71&v=4" width="75px;"/>](https://github.com/Maurelima) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                            [Marco Lima](https://github.com/Maurelima)                                                            |

## Licença

Projetado com ♥ por [Marco Lima](https://github.com/Maurelima). Licenciado sob a [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.pt-br.html).
