import Transaction from "../model/txModel";
import User from "../model/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import Email from "../utils/email";


export const createTx = catchAsync(async (req, res, next) => {
  //we got the req.user from protected route adding sender id to req.body
  req.body.from = req.user._id;

  //here user is the sender

  // 1) get the reciever and check
  const reciever = await User.findById(req.body.to);
  if (!reciever) {
    return next(new AppError(403, 'Reciever Does not exit'));
  }
  // 2) check sender balance if it less than transferred amount then return error
  if (req.user.accountBalance < req.body.amount) {
    return next(new AppError(403, "You don't have enough balance"));
  }

  // 3) check sender and reciever are two diffrent
  if (req.user._id === reciever._id) {
    return next(new AppError(403, 'sender and reciever should be diffrent'));
  }

  //4) saving their balance state for to handle any error during update.so that we can go back to previous state
  const senderBalance = {
    beforeTx: req.user.accountBalance,
    afterTx: req.user.accountBalance - req.body.amount,
  };

  const recieverBalance = {
    beforeTx: reciever.accountBalance,
    afterTx: reciever.accountBalance + req.body.amount,
  };
  try {
    // 5) update sender balance
    const sender = await User.findByIdAndUpdate(
      req.user._id,
      { accountBalance: senderBalance.afterTx },
      {
        new: true,
        runValidators: true,
      }
    );
    // 6) update reciever balance and reiever
    const updatedReciever = await User.findByIdAndUpdate(
      reciever._id,
      { accountBalance: recieverBalance.afterTx },
      {
        runValidators: true,
      }
    );
    //7) save the tx details
    const tx = await Transaction.create(req.body);

    //send success email to sender
    await new Email(sender).sendTxSuccess({
      coinRecieverName: updatedReciever.name,
      sendToSender: true,
    });

    // send success email to reciever
    await new Email(updatedReciever).sendTxSuccess({
      coinSenderName: sender.name,
      amount: req.body.amount,
    });
    // await new Email(sender).sendTxSuccess(sender.name);

    res.status(201).json({
      status: 'success',
      tx,
    });
  } catch (err) {
    //in case of error back to the previous state
    // 1) update sender balance
    const sender = await User.findByIdAndUpdate(
      req.user._id,
      { accountBalance: senderBalance.beforeTx },
      {
        new: true,
        runValidators: true,
      }
    );

    // 2) update reciever balance

    const updatedReciever = await User.findByIdAndUpdate(
      reciever._id,
      { accountBalance: recieverBalance.beforeTx },
      {
        new:true,
        runValidators: true,
      }
    );

    //send fail email to sender
    await new Email(sender).sendTxfail({
      coinRecieverName: updatedReciever.name,
      amount: req.body.amount,
    });

    res.status(500).json({
      status: 'fail',
      message: 'Transaction error. please try again.',
    });
  }
});

export const myTransaction = catchAsync(async (req, res, next) => {
  //get all the transaction where from or to filed matched to the user id
  const txs = await Transaction.find({
    $or: [{ from: req.user._id }, { to: req.user._id }],
  });
  res.status(200).json({
    status: 'success',
    result: txs.length,
    data: {
      Transactions: txs,
    },
  });
});

export const getAllTransactions = catchAsync(async (req, res, next) => {
  const txs = await Transaction.find();
  res.status(200).json({
    status: 'success',
    result: txs.length,
    data: {
      Transactions: txs,
    },
  });
});

export const getTransaction = catchAsync(async (req, res, next) => {
  const tx = await Transaction.findById(req.params.id)
    .populate({ path: 'from' })
    .populate('to');
  if (!tx) {
    return next(new AppError(404, 'No data found!!'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      Transaction: tx,
    },
  });
});
