export async function onRequest(context) {
  try {
    // 添加 CORS 预检请求处理
    if (context.request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const request = context.request;
    const url = new URL(request.url);
    
    const monthlyIncome = parseFloat(url.searchParams.get('income'));
    const months = parseInt(url.searchParams.get('months')) || 1;
    const socialInsurance = parseFloat(url.searchParams.get('socialInsurance')) || 0;
    const specialDeduction = parseFloat(url.searchParams.get('specialDeduction')) || 0;

    console.log('接收到的参数:', {
      monthlyIncome,
      months,
      socialInsurance,
      specialDeduction
    });

    // 增强输入验证
    if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
      throw new Error('请输入有效的月收入金额');
    }

    // 计算累计收入
    const totalIncome = monthlyIncome * months;
    const totalSocialInsurance = socialInsurance * months;
    const totalSpecialDeduction = specialDeduction * months;
    const totalDeduction = (5000 * months) + totalSocialInsurance + totalSpecialDeduction;
    
    // 计算应纳税所得额
    const taxableIncome = totalIncome - totalDeduction;
    
    // 获取税率和速算扣除数
    const { taxRate, quickDeduction } = getTaxRateAndDeduction(taxableIncome);
    
    // 计算累计应纳税额
    const totalTaxDue = taxableIncome > 0 ? (taxableIncome * taxRate - quickDeduction) : 0;
    
    // 计算本月税后收入
    const afterTaxIncome = monthlyIncome - (totalTaxDue / months) - socialInsurance;

    const result = {
      tax: taxableIncome,
      taxRate: taxRate,
      quickDeduction: quickDeduction,
      totalTaxDue: totalTaxDue,
      afterTaxIncome: afterTaxIncome,
    };

    console.log('计算结果:', result);

    return new Response(
      JSON.stringify(result),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('税收计算错误:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || '计算过程中发生错误',
        stack: error.stack,
        url: context.request.url // 添加请求URL信息用于调试
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

function getTaxRateAndDeduction(taxableIncome) {
  if (taxableIncome <= 0) {
    return { taxRate: 0, quickDeduction: 0 };
  }
  
  if (taxableIncome <= 36000) {
    return { taxRate: 0.03, quickDeduction: 0 };
  } else if (taxableIncome <= 144000) {
    return { taxRate: 0.1, quickDeduction: 2520 };
  } else if (taxableIncome <= 300000) {
    return { taxRate: 0.2, quickDeduction: 16920 };
  } else if (taxableIncome <= 420000) {
    return { taxRate: 0.25, quickDeduction: 31920 };
  } else if (taxableIncome <= 660000) {
    return { taxRate: 0.3, quickDeduction: 52920 };
  } else if (taxableIncome <= 960000) {
    return { taxRate: 0.35, quickDeduction: 85920 };
  } else {
    return { taxRate: 0.45, quickDeduction: 181920 };
  }
} 