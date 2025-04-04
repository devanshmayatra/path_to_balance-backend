import { Schema , model } from "mongoose";

const storySchema = new Schema({
  title: { type: String, required: true },
  content:{
    type:[
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      }
    ]
  }
},{
  timestamps: true
});

export const Story = model("Story",storySchema);