const AdminPromo = require('../db/admin_promo');
const CustomerPromo = require('../db/customer_promo');

// * Function to create a promo by admin
const createPromo = async (req, res) => {
  try {
    const code = req?.body?.code;
    if (code) {
      const oldPromo = await AdminPromo.findOne({ code });
      if (oldPromo) {
        await AdminPromo.findByIdAndDelete(oldPromo._id);
        await CustomerPromo.deleteMany({ code });
      }
    }
    const promoObj = {};
    for (let item in req?.body) {
      promoObj[item] = req.body[item];
    }
    const promoCollection = await new AdminPromo(promoObj);
    const promo = await promoCollection.save();
    if (promo) {
      res.status(200).json({ voucher: promo });
    } else {
      res.status(404).json({ message: 'Promo cannot be saved.' });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to apply promo by customer
const applyPromo = async (req, res) => {
  try {
    const code = req?.body?.code;
    if (code) {
      const today = new Date();
      const oldPromo = await AdminPromo.findOne({ code }).lean();
      if (!oldPromo || oldPromo.expiration_date < today) {
        res.status(404).json({ message: 'Voucher is not found' })
      } else {
        const alreadyAppliedPromo = await CustomerPromo.findOne({ code }).lean();
        if (!alreadyAppliedPromo) {
          const promoObj = {};
          for (let item in oldPromo) {
            if (item !== 'expiration_date') {
              promoObj[item] = oldPromo[item];
            }
          }
          promoObj.count = 1;
          const newPromoCollection = await new CustomerPromo(promoObj);
          const newPromo = await newPromoCollection.save();
          if (newPromo) {
            res.status(200).json({ promo: newPromo });
          } else {
            res.status(404).json({ message: 'Cannot apply voucher' });
          }
        } else {
          if (alreadyAppliedPromo.count === alreadyAppliedPromo.total) {
            res.status(400).json({ message: 'Already applied voucher'})
          } else {
            alreadyAppliedPromo.count ++;
            const updatedAppliedPromo = await CustomerPromo.findByIdAndUpdate(alreadyAppliedPromo._id, alreadyAppliedPromo, {new: true});
            if (updatedAppliedPromo) {
              res.status(200).json({ voucher: updatedAppliedPromo });
            } else {
              res.status(404).json({ message: 'Cannot apply voucher' });
            }
          }
        }
      }
    } else {
      res.status(400).json({ message: 'Code is not provided' });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createPromo,
  applyPromo,
};