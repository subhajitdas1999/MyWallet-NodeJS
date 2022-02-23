import mongoose from "mongoose";
const txSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Transaction sender is required'],
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Transaction reciever is required'],
  },
  amount: {
    type: Number,
    required: [true, 'transaction amount is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


// txSchema.pre('findOne',function(next){
//     this.populate({path:'from'})
//     next();
// })

const Transaction = mongoose.model('Transaction', txSchema);

export default Transaction;
