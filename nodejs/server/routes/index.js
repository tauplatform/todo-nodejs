var models = require('../models');
var express = require('express');
var session = require('express-session');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/tasks/all');
});

router.get('/tasks', function (req, res, next) {
    res.redirect('/tasks/all');
});

router.get('/tasks/all', function (req, res, next) {
    models.Task.findAll().then(function (tasks) {
        req.session.view = 'all';
        res.render('index', {"tasks": tasks});
    });
});

router.get('/tasks/active', function (req, res, next) {
    models.Task.findAll({
        where: {
            completed: false
        }
    }).then(function (tasks) {

        req.session.view = 'active';
        res.render('active', {"tasks": tasks});
    });
});

router.get('/tasks/completed', function (req, res, next) {
    models.Task.findAll({
        where: {
            completed: true
        }
    }).then(function (tasks) {
        req.session.view = 'completed';
        res.render('completed', {"tasks": tasks});
    });
});

router.post('/tasks/create', function (req, res, next) {
    models.Task.create({
        title: req.body.title,
        completed: false
    }).then(function () {
        url = (req.session && req.session.view) ? req.session.view : 'all';
        res.redirect('/tasks/' + url);
    });
});

router.get('/tasks/:task_id/complete', function (req, res) {
    models.Task.find({
        where: {
            id: req.params.task_id
        }
    }).then(function (task) {
        task.completed = true;
        task.save({fields: ['completed']}).then(function () {
            url = (req.session && req.session.view) ? req.session.view : 'all';
            res.redirect('/tasks/' + url);
        })
    });
});

router.get('/tasks/:task_id/uncomplete', function (req, res) {
    models.Task.find({
        where: {
            id: req.params.task_id
        }
    }).then(function (task) {
        task.completed = false;
        task.save({fields: ['completed']}).then(function () {
            url = (req.session && req.session.view) ? req.session.view : 'all';
            res.redirect('/tasks/' + url);
        })
    });
});

router.get('/tasks/:task_id/destroy', function (req, res) {
    models.Task.destroy({
        where: {
            id: req.params.task_id
        }
    }).then(function () {
        url = (req.session && req.session.view) ? req.session.view : 'all';
        res.redirect('/tasks/' + url);
    });
});

module.exports = router;