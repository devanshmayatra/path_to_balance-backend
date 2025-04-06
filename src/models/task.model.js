import { Schema , model } from "mongoose";

const taskSchema = new Schema({
  userId:{
    type: Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  dailyTask:{
    type:[
      {
        Title:{
          type:String,
          required:true
        },
        Description:{
          type:String,
          required:true
        },
        status:{
          type:Boolean,
          required:true,
          default:false
        }
      }
    ]
  },
  weeklyTask:{
    type:[
      {
        Title:{
          type:String,
        },
        Description:{
          type:String,
        },
        status:{
          type:Boolean,
          default:false
        }
      }
    ],
    default:[],
  },
},{
  timestamps:true
});

export const Task = model('Task',taskSchema);