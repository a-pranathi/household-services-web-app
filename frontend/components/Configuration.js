
export default {
    template : `
    <div class="card mt-5 p-3" style="width: 40rem;">
      <div class="card-body">
        <h4>System Alert Configuration</h4>
        <hr/>
        <div class="form-floating mt-2">
            <input type = "number" step = "1" class="form-control" id="minuteField" v-model="configuration.minute" required>
            <label for="minuteField">Minute</label>
        </div>
        <div class="form-floating mt-2">
            <input type = "number" step = "1" class="form-control" id="hourField" v-model="configuration.hour" required>
            <label for="hourField">Hour</label>
        </div>
        <div class="form-floating mt-2">
            <select class="form-select" id="dayOfWeekField" v-model="configuration.day_of_week" required>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="7">Sunday</option>                                                                                
            </select>
            <label for="dayOfWeekField">Day of Week</label>
        </div>
        <div class="form-floating mt-2">
            <input type = "number" step = "1" class="form-control" id="dayOfMonthField" v-model="configuration.day_of_month" required>
            <label for="dayOfMonthField">Day of Month</label>
        </div>
        <div class="form-floating mt-2">
            <input type = "number" step = "1" class="form-control" id="momoizeTimeoutField" v-model="configuration.memoize_timeout" required>
            <label for="momoizeTimeoutField">Memoize timeout (in seconds)</label>
        </div>            
        <div class="form-floating mt-2">
            <input type = "number" step = "1" class="form-control" id="cacheTimeoutField" v-model="configuration.cache_timeout" required>
            <label for="cacheTimeoutField">Cache timeout (in seconds)</label>
        </div>            
        <div>                
          <button class="btn btn-primary mt-4" @click="submitConfiguration">Update</button>
        </div>
      </div>
    </div>
  `,

  data(){
    return{
      configuration : {
        minute : 0,
        hour : 12,
        day_of_week : 1,
        day_of_month : 1,
        memoize_timeout : 5,
        cache_timeout : 10,
      }
    }
  },

  methods: {
    submitConfiguration() { 
      const httbody = JSON.stringify(this.configuration);
      alert ("Configuration details are submitted!")
    },
  },
}
