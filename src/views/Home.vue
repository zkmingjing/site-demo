<template>
  <div class="home">
    <div class="main-content">
      <AiKnowledge />
      <AiChat />
    </div>
    <div class="calculator-hint" v-show="!showCalculator">
      <span class="hint-text">点击打开个税计算器</span>
      <span class="hint-arrow">›</span>
    </div>
    <div class="calculator-toggle" @click="showCalculator = !showCalculator">
      <div class="toggle-icon">
        {{ showCalculator ? '‹' : '›' }}
      </div>
    </div>
    <div class="tax-calculator" :class="{ show: showCalculator }" v-show="showCalculator">
      <div class="calculator-content">
        <div class="left-section">
          <h3>累计预扣预缴个税计算器</h3>
          <div class="form-group">
            <label>纳税期数：</label>
            <select v-model.number="months">
              <option v-for="n in 12" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>本月工资：</label>
            <input type="number" v-model.number="monthlyIncome" placeholder="请输入" />
          </div>

          <div class="form-group">
            <label>累计：</label>
            <input type="number" :value="totalIncome" disabled />
          </div>

          <div class="form-group">
            <label>社会保险费：</label>
            <input type="number" v-model.number="socialInsurance" />
          </div>

          <div class="form-group">
            <label>累计：</label>
            <input type="number" :value="totalSocialInsurance" disabled />
          </div>

          <div class="form-group">
            <label>专项附加扣除：</label>
            <input type="number" v-model.number="specialDeduction" />
          </div>

          <div class="form-group">
            <label>累计：</label>
            <input type="number" :value="totalSpecialDeduction" disabled />
          </div>
        </div>

        <div class="right-section">
          <h3>个人所得税计算结果</h3>
          <div class="result-group">
            <label>应纳税所得额</label>
            <span>{{ taxableIncome }}元</span>
          </div>

          <div class="result-group">
            <label>适用税率</label>
            <span>{{ taxRate }}%</span>
          </div>

          <div class="result-group">
            <label>速算扣除数</label>
            <span>{{ quickDeduction }}元</span>
          </div>

          <div class="result-group">
            <label>已缴税款</label>
            <input type="number" v-model.number="paidTax" />
          </div>

          <div class="result-group">
            <label>累计应缴税款</label>
            <input type="number" :value="totalTaxDue" disabled />
          </div>

          <div class="result-group">
            <label>应补(退)税款</label>
            <input type="number" :value="taxBalance" disabled />
          </div>

          <div class="result-group">
            <label>本月税后收入</label>
            <input type="number" :value="afterTaxIncome" disabled />
          </div>
        </div>
      </div>

      <div class="button-group">
        <button class="calculate-btn" @click="calculate">
          <i class="icon-calculator"></i>
          计算
        </button>
        <button class="reset-btn" @click="reset">
          <i class="icon-reset"></i>
          重置
        </button>
      </div>

      <div class="tip">
        新个税累计预扣预缴计算方法太复杂，很难理解，试一试每月录入，分解计算吧！
      </div>
    </div>
  </div>
</template>

<script>
import AiKnowledge from '../components/AiKnowledge.vue';
import AiChat from '../components/AiChat.vue';

export default {
  name: 'Home',
  components: {
    AiKnowledge,
    AiChat
  },
  data() {
    return {
      showCalculator: false,
      months: 1,
      monthlyIncome: 0,
      socialInsurance: 0,
      specialDeduction: 0,
      paidTax: 0,
      taxableIncome: 0,
      taxRate: 0,
      quickDeduction: 0,
      totalTaxDue: 0,
      taxBalance: 0,
      afterTaxIncome: 0
    };
  },
  computed: {
    totalIncome() {
      return this.monthlyIncome * this.months;
    },
    totalSocialInsurance() {
      return this.socialInsurance * this.months;
    },
    totalSpecialDeduction() {
      return this.specialDeduction * this.months;
    }
  },
  methods: {
    calculate() {
      // 计算应纳税所得额
      const totalDeduction = (5000 * this.months) + this.totalSocialInsurance + this.totalSpecialDeduction;
      this.taxableIncome = Math.max(0, this.totalIncome - totalDeduction);

      // 获取税率和速算扣除数
      const { taxRate, quickDeduction } = this.getTaxRateAndDeduction(this.taxableIncome);
      this.taxRate = taxRate * 100;
      this.quickDeduction = quickDeduction;

      // 计算累计应纳税额
      this.totalTaxDue = this.taxableIncome > 0 ? (this.taxableIncome * taxRate - quickDeduction) : 0;

      // 计算应补(退)税款
      this.taxBalance = this.totalTaxDue - this.paidTax;

      // 计算本月税后收入
      this.afterTaxIncome = this.monthlyIncome - (this.totalTaxDue / this.months) - this.socialInsurance;
    },

    getTaxRateAndDeduction(taxableIncome) {
      if (taxableIncome <= 0) return { taxRate: 0, quickDeduction: 0 };
      if (taxableIncome <= 36000) return { taxRate: 0.03, quickDeduction: 0 };
      if (taxableIncome <= 144000) return { taxRate: 0.1, quickDeduction: 2520 };
      if (taxableIncome <= 300000) return { taxRate: 0.2, quickDeduction: 16920 };
      if (taxableIncome <= 420000) return { taxRate: 0.25, quickDeduction: 31920 };
      if (taxableIncome <= 660000) return { taxRate: 0.3, quickDeduction: 52920 };
      if (taxableIncome <= 960000) return { taxRate: 0.35, quickDeduction: 85920 };
      return { taxRate: 0.45, quickDeduction: 181920 };
    },

    reset() {
      this.months = 1;
      this.monthlyIncome = 0;
      this.socialInsurance = 0;
      this.specialDeduction = 0;
      this.paidTax = 0;
      this.taxableIncome = 0;
      this.taxRate = 0;
      this.quickDeduction = 0;
      this.totalTaxDue = 0;
      this.taxBalance = 0;
      this.afterTaxIncome = 0;
    }
  }
};
</script>

<style scoped>
.main-content {
  max-width: 1200px;
  margin: 0 auto 0 40px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (min-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr 1fr;
  }
}

.calculator-toggle {
  position: fixed;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  cursor: pointer;
  transition: left 0.3s;
}

.calculator-toggle:not(.tax-calculator[style*="display: none"]) {
  left: 0;
}

.toggle-icon {
  width: 24px;
  height: 60px;
  background: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 4px 4px 0;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.toggle-icon:hover {
  background: #45a049;
}

.tax-calculator {
  position: fixed;
  left: -800px;
  top: 50%;
  transform: translateY(-50%);
  width: 800px;
  background: #fff;
  padding: 20px 20px 20px 40px;
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transition: left 0.3s ease;
}

.tax-calculator.show {
  left: 22px;
}

.tax-calculator[style*="display: none"] {
  left: -800px;
}

.calculator-content {
  display: flex;
  gap: 20px;
}

.left-section, .right-section {
  flex: 1;
  min-width: 300px;
}

h3 {
  color: #333;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4CAF50;
  font-size: 16px;
}

.right-section h3 {
  color: #4CAF50;
  border-bottom: 1px solid #eee;
}

.form-group, .result-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

label {
  width: 120px;
  color: #333;
}

input, select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

input:disabled {
  background: #f5f5f5;
  color: #666;
}

.button-group {
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.calculate-btn, .reset-btn {
  padding: 10px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.calculate-btn {
  background: #4CAF50;
  color: white;
}

.reset-btn {
  background: #2196F3;
  color: white;
}

.calculate-btn:hover {
  background: #45a049;
}

.reset-btn:hover {
  background: #1976D2;
}

.tip {
  width: 100%;
  text-align: center;
  color: #ff6b01;
  margin-top: 15px;
  font-size: 14px;
}

.result-group span {
  flex: 1;
  padding: 8px;
  color: #ff4444;
  font-weight: bold;
}

.calculator-hint {
  position: fixed;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  padding: 15px 10px;
  border-radius: 4px;
  font-size: 14px;
  animation: fadeIn 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 998;
}

.hint-text {
  writing-mode: vertical-lr;
  text-orientation: upright;
  letter-spacing: 4px;
  line-height: 1.5;
}

.hint-arrow {
  font-size: 24px;
  transform: rotate(90deg);
  margin-top: 5px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}
</style> 