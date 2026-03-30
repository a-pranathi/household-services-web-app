export default {
    template : `
    <div class="container mt-5">
      <h2 class="mb-4">Payment Options</h2>
      <div class="row">
        <div class="col-md-4">
          <div class="list-group mt-2">
            <a href="#" class="list-group-item list-group-item-action" :class="{ active: paymentMethod === 'creditCard' }" @click.prevent="paymentMethod = 'creditCard'">Credit Card</a>
            <a href="#" class="list-group-item list-group-item-action" :class="{ active: paymentMethod === 'debitCard' }" @click.prevent="paymentMethod = 'debitCard'">Debit Card</a>
            <a href="#" class="list-group-item list-group-item-action" :class="{ active: paymentMethod === 'upi' }" @click.prevent="paymentMethod = 'upi'">UPI</a>
            <a href="#" class="list-group-item list-group-item-action" :class="{ active: paymentMethod === 'netBanking' }" @click.prevent="paymentMethod = 'netBanking'">Net Banking</a>
          </div>
        </div>
        <div class="col-md-8">
          <form @submit.prevent="processPayment">
            <div v-if="paymentMethod === 'creditCard' || paymentMethod === 'debitCard'">
              <div class="form-floating mt-2">
                <input type="text" class="form-control" id="cardNumber" v-model="cardNumber" required>
                <label for="cardNumber">Card Number</label>
              </div>
              <div class="form-floating mt-2">
                <input type="text" class="form-control" id="expiryDate" v-model="expiryDate" required>
                <label for="expiryDate">Expiry Date</label>
              </div>
              <div class="form-floating mt-2">
                <input type="text" class="form-control" id="cvv" v-model="cvv" required>
                <label for="cvv">CVV</label>
              </div>
            </div>
            <div v-if="paymentMethod === 'upi'">
              <div class="form-floating mt-2">
                <input type="text" class="form-control" id="upiId" v-model="upiId" required>
                <label for="upiId">UPI ID</label>
              </div>
            </div>
            <div v-if="paymentMethod === 'netBanking'">
              <div class="form-floating mt-2">
                <input type="text" class="form-control" id="bankName" v-model="bankName" required>
                <label for="bankName">Bank Name</label>
              </div>
              <div class="form-floating mt-2">
                <input type="text" class="form-control" id="accountNumber" v-model="accountNumber" required>
                <label for="accountNumber">Account Number</label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Submit Payment</button>
          </form>
        </div>
      </div>
    </div>
    `,
    data(){
        return {
            paymentMethod: 'creditCard',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            upiId: '',
            bankName: '',
            accountNumber: ''    
        }
    },
    methods: {
        processPayment() {
          alert('Payment processed');
        }
    },
} 