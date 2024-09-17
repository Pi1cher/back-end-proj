import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    header: { type: String, required: true },
    content: { type: String, required: true },
    send_to: { type: Types.ObjectId },
    send_by: { type: Types.ObjectId },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Message = model("Message", messageSchema);

export default Message;
