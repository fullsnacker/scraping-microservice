/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsUrl, IsOptional, IsNotEmpty } from 'class-validator';

export class ScrapingRequestDto {
  @IsUrl({}, { message: 'La URL debe ser una dirección web válida' })
  @IsNotEmpty({ message: 'La URL es requerida' })
  url: string;

  @IsString({ message: 'El nombre de la regla debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la regla es requerido' })
  ruleName: string;

  @IsOptional()
  options?: any;
}
