export default {
  template : `
      <div>
      <div>
      <div class="card mt-1 p-3">
        <h3 class="text-primary text-center"> Welcome to the Summary dashboard!</h3>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 30px;">
        <!-- Bar Chart -->
        <div class="card p-5" style="flex: 1; max-width: 70%; height: 500px;">
          <canvas ref="barChart"></canvas>
        </div>
        <div>
        &ensp; &ensp; &ensp;
        </div>
        <!-- Pie Chart -->
        <div class="card p-5" style="height: 500px;">
          <canvas ref="pieChart"></canvas>
        </div>
      </div>  
      <div style="display: flex; justify-content: center; margin-top: 30px;">
        <!-- Second Bar Chart -->
        <div class="card p-5" style="flex: 1; max-width: 65%; height: 500px;">
          <canvas ref="barChart2"></canvas>
        </div>
      </div>
    </div>
      </div>
              `, 
              data() {
                  return{
      bookingStatus: [],
      rating: [],
      serviceBookings: []
  }
},
methods : {
  },
  
  async mounted(){
      const ratings = await fetch(location.origin + "/api/graph/reviews",{
          headers : {
              "Authentication-Token" : this.$store.state.auth_token
          }
      })
      
      this.rating = await ratings.json()
      
      const bookingstatus = await fetch(location.origin + "/api/graph/bookingstatus",{
          headers : {
              "Authentication-Token" : this.$store.state.auth_token
          }
      })

      this.bookingStatus = await bookingstatus.json()
      
      const servicebookings = await fetch(location.origin + "/api/graph/servicebookings",{
          headers : {
              "Authentication-Token" : this.$store.state.auth_token
          }
      })

      this.serviceBookings = await servicebookings.json()

      const bartData = {
          labels: Object.keys(this.bookingStatus),
          datasets: [{
            // label: Object.keys(this.bookingStatus),
            data: Object.values(this.bookingStatus),
            backgroundColor: [
              'rgba(255, 99, 132, 0.4)',
              'rgba(255, 159, 64, 0.4)',
              'rgba(255, 205, 86, 0.4)',
              'rgba(75, 192, 192, 0.4)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)'
            ],
            borderWidth: 1
          }]
        };

      const bart2Data = {
          labels: this.serviceBookings.map(item => item.service_name),  
          datasets: [{
            // label: Object.keys(this.rating),
            data: this.serviceBookings.map(item => item.booking_count),
            backgroundColor: [
              'rgba(255, 99, 132, 0.4)',
              'rgba(255, 159, 64, 0.4)',
              'rgba(255, 205, 86, 0.4)',
              'rgba(75, 192, 192, 0.4)',
              'rgba(54, 162, 235, 0.4)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)'
            ],
            borderWidth: 1
          }]
        };          
        
      const pietData = {
          labels: Object.keys(this.rating),
          datasets: [{
            labels: Object.keys(this.rating),
            data: Object.values(this.rating),
            backgroundColor: [
              'rgba(255, 99, 132, 0.4)',
              'rgba(255, 159, 64, 0.4)',
              'rgba(255, 205, 86, 0.4)',
              'rgba(75, 192, 192, 0.4)',
              'rgba(54, 162, 235, 0.4)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)'
            ],
            borderWidth: 1
          }]
        };

        const barConfig = {
          type: 'bar',
          data: bartData,
          options: {
              plugins:{
                  title: {
                      display: true,
                      text: "Booking Status"
                  },
                  legend: {
                    display: false
                  }
              },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          },
        };

        const bar2Config = {
          type: 'bar',
          data: bart2Data,
          options: {
              plugins:{
                  title: {
                      display: true,
                      text: "Bookings by Service"
                  },
                  legend: {
                    display: false
                  }
              },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          },
        };
        
        const pieConfig = {
          type: 'pie',
          data: pietData,
          options: {
              plugins:{
                  title: {
                      display: true,
                      text: "Rating Distribution"
                  }
              }
          },
        };

        const statusChart = new Chart(
          this.$refs.barChart,
          barConfig
        );

        const serviceBookingChart = new Chart(
          this.$refs.barChart2,
          bar2Config
        );

        const ratingChart = new Chart(
          this.$refs.pieChart,
          pieConfig
        );
  }
}