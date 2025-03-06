var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let categoryModel = require('../schemas/category')

function buildQuery(obj) {
    console.log(obj);
    let result = {};
    if (obj.name) {
        result.name = new RegExp(obj.name, 'i');
    }
    return result;
}

/* GET users listing. */
router.get('/', async function (req, res, next) {
    let categoriesQuery = await categoryModel.find(buildQuery(req.query));
    const categories = categoriesQuery.filter(category => !category.isDeleted);
    res.status(200).send({
        success: true,
        data: categories
    });
});
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let category = await categoryModel.findById(id);
        if (category.isDeleted) {
            return res.status(404).send({
                success: false,
                message: "khong co id phu hop"
            });
        }
        res.status(200).send({
            success: true,
            data: category
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
        let newCategory = new categoryModel({
            name: req.body.name,
            description: req.body.description
        })
        await newCategory.save();
        res.status(200).send({
            success: true,
            data: newCategory
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
        let category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "khong co id phu hop"
            });
        }
        if (category.isDeleted) {
            return res.status(404).send({
                success: false,
                message: "khong co id phu hop"
            });
        }
        category.name = req.body.name;
        category.description = req.body.description;
        await category.save();
        res.status(200).send({
            success: true,
            data: category
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
        let category = await categoryModel.findById(id);
        category.isDeleted = true;
        await category.save();
        res.status(200).send({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "khong co id phu hop"
        });
    }
});
module.exports = router;