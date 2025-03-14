var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let productModel = require('../schemas/product')

function buildQuery(obj) {
    console.log(obj);
    let result = {};
    if (obj.name) {
        result.name = new RegExp(obj.name, 'i');
    }
    result.price = {};
    if (obj.price) {
        if (obj.price.$gte) {
            result.price.$gte = obj.price.$gte;
        } else {
            result.price.$gte = 0
        }
        if (obj.price.$lte) {
            result.price.$lte = obj.price.$lte;
        } else {
            result.price.$lte = 10000;
        }

    }
    return result;
}

/* GET users listing. */
router.get('/', async function (req, res, next) {


    let productsQuery = await productModel.find(buildQuery(req.query));
    const products = productsQuery.filter(product => !product.isDeleted);
    res.status(200).send({
        success: true,
        data: products
    });
});
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let product = await productModel.findById(id);
        if (product.isDeleted) {
            return res.status(404).send({
                success: false,
                message: "khong co id phu hop"
            });
        }
        res.status(200).send({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "khong co id phu hop"
        });
    }
});

router.post('/', async function (req, res, next) {
    try {
        let newProduct = new productModel({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            quantity: req.body.quantity,
            category: req.body.category
        })
        await newProduct.save();
        res.status(200).send({
            success: true,
            data: newProduct
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        });
    }
});
router.put('/:id', async function (req, res, next) {

    try {
        let id = req.params.id;
        let product = await productModel.findById(id);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "khong co id phu hop"
            });
        }
        if (product.isDeleted) {
            return res.status(404).send({
                success: false,
                message: "khong co id phu hop"
            });
        }
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.imgURL = req.body.imgURL;
        product.quantity = req.body.quantity;
        product.category = req.body.category;
        await product.save();
        res.status(200).send({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "khong co id phu hop"
        });
    }
});
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let product = await productModel.findById(id);
        product.isDeleted = true;
        await product.save();
        res.status(200).send({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "khong co id phu hop"
        });
    }
});
module.exports = router;