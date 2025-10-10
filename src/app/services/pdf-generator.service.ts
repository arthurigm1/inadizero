import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';
import { Contract } from '../features/contracts/contract.interfaces';

export interface ContractData {
  id: string;
  loja: any;
  inquilino: any;
  valorAluguel: number;
  dataInicio: string;
  dataFim: string;
  reajusteAnual: boolean;
  percentualReajuste?: number;
  clausulas?: string;
  observacoes?: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor(private http: HttpClient) { }

  /**
   * Gera PDF do contrato com os dados fornecidos
   */
  generateContractPdf(contractData: ContractData): Observable<Blob> {
    return new Observable(observer => {
      this.generatePdf(contractData).then(blob => {
        observer.next(blob);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  private async generatePdf(contractData: ContractData): Promise<Blob> {
    try {
      // Carrega o template HTML
      const template = await this.loadTemplate();
      
      // Substitui os placeholders pelos dados reais
      const htmlContent = this.replacePlaceholders(template, contractData);
      
      // Cria um elemento temporário para renderizar o HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.padding = '20mm';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.5';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      
      document.body.appendChild(tempDiv);
      
      // Converte para canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove o elemento temporário
      document.body.removeChild(tempDiv);
      
      // Cria o PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      return pdf.output('blob');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }

  /**
   * Carrega o template HTML do contrato
   */
  private async loadTemplate(): Promise<string> {
    try {
      const response = await this.http.get('/assets/contrato-template.html', { responseType: 'text' }).toPromise();
      return response || '';
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      throw new Error('Falha ao carregar template do contrato.');
    }
  }

  /**
   * Substitui os placeholders no template pelos dados reais
   */
  private replacePlaceholders(template: string, data: ContractData): string {
    let content = template;
    
    // Dados básicos do contrato
    content = content.replace(/\[LOCADOR_NOME\]/g, data.loja?.proprietario || 'Nome do Locador');
    content = content.replace(/\[LOCADOR_CPF\]/g, data.loja?.cpfProprietario || '000.000.000-00');
    content = content.replace(/\[LOCATARIO_NOME\]/g, data.inquilino?.nome || 'Nome do Locatário');
    content = content.replace(/\[LOCATARIO_RG\]/g, data.inquilino?.rg || '00.000.000-0');
    content = content.replace(/\[LOCATARIO_CPF\]/g, data.inquilino?.cpf || '000.000.000-00');
    content = content.replace(/\[ENDERECO_COMPLETO\]/g, data.inquilino?.endereco || 'Endereço completo');
    content = content.replace(/\[DDD\]/g, data.inquilino?.telefone?.substring(0, 2) || '43');
    content = content.replace(/\[TELEFONE\]/g, data.inquilino?.telefone?.substring(2) || '00000-0000');
    
    // Dados do imóvel
    content = content.replace(/\[OBJETO_DESCRICAO\]/g, `Loja ${data.loja?.numero} - ${data.loja?.descricao || 'Descrição da loja'}`);
    
    // Datas e prazos
    const dataInicio = new Date(data.dataInicio);
    const dataFim = new Date(data.dataFim);
    const prazoMeses = Math.round((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    content = content.replace(/\[PRAZO_MESES\]/g, prazoMeses.toString());
    content = content.replace(/\[DATA_INICIO\]/g, this.formatDate(data.dataInicio));
    content = content.replace(/\[DATA_FIM\]/g, this.formatDate(data.dataFim));
    
    // Valores
    const valorInicial = data.valorAluguel;
    const valorDepois = data.reajusteAnual && data.percentualReajuste 
      ? valorInicial * (1 + data.percentualReajuste / 100) 
      : valorInicial;
    
    content = content.replace(/\[R\$INICIAL\]/g, this.formatCurrency(valorInicial));
    content = content.replace(/\[VALOR_INICIAL_EXTENSO\]/g, this.numberToWords(valorInicial));
    content = content.replace(/\[DIA_VENC\]/g, '10'); // Dia padrão de vencimento
    content = content.replace(/\[R\$DEPOIS\]/g, this.formatCurrency(valorDepois));
    content = content.replace(/\[VALOR_DEPOIS_EXTENSO\]/g, this.numberToWords(valorDepois));
    
    // Dados adicionais (valores padrão para campos não disponíveis)
    content = content.replace(/\[FIADOR_NOME\]/g, 'Nome do Fiador');
    content = content.replace(/\[FIADOR_CPF\]/g, '000.000.000-00');
    content = content.replace(/\[TESTEMUNHA1_NOME\]/g, 'Nome da Testemunha 1');
    content = content.replace(/\[TESTEMUNHA1_CPF\]/g, '000.000.000-00');
    content = content.replace(/\[TESTEMUNHA2_NOME\]/g, 'Nome da Testemunha 2');
    content = content.replace(/\[TESTEMUNHA2_CPF\]/g, '000.000.000-00');
    
    // Data por extenso
    const hoje = new Date();
    content = content.replace(/\[DATA_EXTENSO\]/g, this.formatDateExtended(hoje));
    
    return content;
  }

  /**
   * Formata data no padrão brasileiro
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Formata data por extenso
   */
  private formatDateExtended(date: Date): string {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  }

  /**
   * Converte número para palavras (alias para convertToWords)
   */
  private numberToWords(value: number): string {
    return this.convertToWords(value);
  }

  /**
   * Formata valor monetário
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Converte número para extenso (implementação básica)
   */
  convertToWords(value: number): string {
    // Implementação básica - pode ser expandida conforme necessário
    const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    if (value === 0) return 'zero reais';
    if (value === 100) return 'cem reais';

    let result = '';
    const integerPart = Math.floor(value);
    const decimalPart = Math.round((value - integerPart) * 100);

    // Processar parte inteira
    if (integerPart >= 1000) {
      const thousands = Math.floor(integerPart / 1000);
      if (thousands === 1) {
        result += 'mil';
      } else {
        result += this.convertHundreds(thousands) + ' mil';
      }
      
      const remainder = integerPart % 1000;
      if (remainder > 0) {
        result += ' e ' + this.convertHundreds(remainder);
      }
    } else {
      result = this.convertHundreds(integerPart);
    }

    result += integerPart === 1 ? ' real' : ' reais';

    // Processar centavos
    if (decimalPart > 0) {
      result += ' e ' + this.convertHundreds(decimalPart);
      result += decimalPart === 1 ? ' centavo' : ' centavos';
    }

    return result;
  }

  private convertHundreds(num: number): string {
    const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    let result = '';

    if (num >= 100) {
      result += hundreds[Math.floor(num / 100)];
      num %= 100;
      if (num > 0) result += ' e ';
    }

    if (num >= 20) {
      result += tens[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) result += ' e ';
    } else if (num >= 10) {
      result += teens[num - 10];
      num = 0;
    }

    if (num > 0) {
      result += units[num];
    }

    return result;
  }
}