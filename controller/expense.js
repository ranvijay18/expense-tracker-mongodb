const Expense = require('../model/expense');
const User = require('../model/user');
const S3Services = require('../services/s3services');
const Download = require('../model/download');
let userId;
let isPremium;
let totalExpenseAmount;
let totalItems;
let rowsPerPage;

async function addExpense(id, amount) {

    const users = await User.find({ _id: id});
    let user = users[0];

    const total = user.totalExpenses + +amount;
    await User.updateOne({ _id: id}, {$set: {totalExpenses: total}});

}

async function delExpense(id, amount) {

    const users = await User.find({ _id: id })
    const user = users[0];

    const total = user.totalExpenses - +amount;

    await User.updateOne({ _id: id}, {$set: {totalExpenses: total}});
    return total;

}



exports.getExpenses = async (req, res, next) => {
    userId = req.user._id;
    isPremium = req.user.isPremium;
    const rows = req.header('row');
    const pageSize = +rows;
    totalExpenseAmount = req.user.totalExpenses;
    const pageNumber = req.params.page;
    const skip = (pageNumber - 1) * pageSize;

    const totalItems = await Expense.countDocuments();

  await Expense.find({ userId })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(pageSize)
    .exec()
    .then((expenses)=> {
       res.status(201).json({
        detail: expenses,
        user: isPremium,
        currentPage: pageNumber,
        hasNextPage: pageSize*pageNumber < totalItems,
        nextPage: +pageNumber+1,
        hasPreviousPage: pageNumber > 1,
        lastPage: Math.ceil(totalItems/pageSize),
        total: totalExpenseAmount,
        totalItems: totalItems
     })
    })
 
    //  res.status(201).json({
    //     detail: expenses,
    //     user: isPremium,
    //     currentPage: pageNumber,
    //     hasNextPage: pageSize*pageNumber < totalItems,
    //     nextPage: +pageNumber+1,
    //     hasPreviousPage: pageNumber > 1,
    //     lastPage: Math.ceil(totalItems/pageSize),
    //     total: totalExpenseAmount,
    //     totalItems: totalItems
    //  })
}


exports.postExpense = async (req, res, next) => {
    const amount = req.body.amount;
    const des = req.body.des;
    const cat = req.body.cat;
    const user = userId


    await addExpense(user, amount);


    const result = new Expense({
        amount: amount,
        description: des,
        category: cat,
        userId: user,
    })
   result.save();
    res.status(201).json(result);
}

exports.getEditExpense = async (req, res, next) => {
    const expenseId = req.params.expenseId;
    const expenses = await Expense.find({_id: expenseId, userId: userId })
    const expense = expenses[0];
    const total = await delExpense(expense.userId, expense.amount);
    res.status(201).json({ editExpense: expenses[0] , total: total , totalItems:totalItems});

    Expense.deleteOne({_id: expenseId});

}

exports.getDeleteExpense = async (req, res, next) => {

    try {
        const expenseId = req.params.expenseId;
        const expenses = await Expense.find({_id: expenseId, userId: userId});
        const expense = expenses[0];

        console.log(expense);

       const total =  await delExpense(expense.userId, expense.amount);

        res.status(201).json({ status: true, delExpense: expense, total: total, totalItems:totalItems });
        Expense.deleteOne({_id: expenseId});
    }
    catch (err) {
        res.status(201).json({ status: false, message: "User is not Authorized!!!" });
    }

}

exports.downloadExpenses = async (req, res, next) => {
      
    try {
        const expenses = await Expense.find({userId: req.user.id});


        const userID = req.user.id
        const stringifiedExpenses = JSON.stringify(expenses);
        const filename = `Expenses${userID}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
        console.log(fileURL);

        const result = new Download({
            fileUrl : fileURL,
            userId: req.user.id
        })  
        
        result.save();
        res.status(201).json({ fileURL, status: true , details: expenses});
    }
    catch (err) {
        console.log(err);
    }



}

exports.reportExpenses = async (req, res, next) => {
    const expenses = await Expense.find({userId: req.user.id});
    const totalAmount = req.user.totalExpenses;
    const download = await Download.find({userId : req.user.id});
    res.status(201).json({details: expenses , totalAmount:totalAmount, download: download});
}