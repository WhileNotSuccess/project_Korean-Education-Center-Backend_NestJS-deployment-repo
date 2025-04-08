// 문성윤, 250326, AI 자동 번역
import { Injectable } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly model: ChatOpenAI;
  private readonly parser: StringOutputParser;
  private readonly codePrompt: PromptTemplate;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = new ChatOpenAI({
      model: 'gpt-4',
      openAIApiKey: this.apiKey,
    });

    this.parser = new StringOutputParser();

    this.codePrompt = PromptTemplate.fromTemplate(
      `다음 HTML 문서를 읽고 태그 안의 문자열을 영어로 번역해주세요.
      해당 문서에 들어있는 태그 이외에 새로운 태그가 생기면 안됩니다.
      <HTML 문서>
      {html}`,
    );
  }
  async create(createAiDto: CreateAiDto) {
    console.log(createAiDto);
    try {
      const languageResult = await this.parser.invoke(
        await this.model.invoke(
          await this.codePrompt.format({ html: createAiDto.html }),
        ),
      );

      return {
        result: languageResult.replace('<HTML Document>\n', ''),
      };
    } catch (e) {
      console.error('번역중 에러 발생');
    }
  }
}
