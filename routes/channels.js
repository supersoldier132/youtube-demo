const express = require('express')
const router = express.Router()
const conn = require("../mariadb")
const { body, param, validationResult } = require("express-validator")

router.use(express.json())

const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()) {
        return next()
    } else {
        return res.status(400).json(err.array())
    }
}

router

    .route('/')

    .get([
        body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'),
        validate
    ],
        (req, res) => {
            var { userId } = req.body

            let sql = `SELECT * FROM channels WHERE user_id = "${userId}"`
            conn.query(sql,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        notFoundChannel(res)
                    }
                }
            )
        })


    .post([
        body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'),
        body('name').notEmpty().isString().withMessage('문자 입력 필요'),
        validate
    ],
        (req, res) => {
            const { name, userId } = req.body

            let sql = `INSERT INTO channels (name, user_id) VALUES ("${name}", "${userId}")`
            conn.query(sql,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }
                    res.status(201).json(results)
                }
            )
        })

router
    .route('/:id')

    .put([
        param('id').notEmpty().withMessage('채널ID 필요'),
        body('name').notEmpty().isString().withMessage('채널명 오류'),
        validate
    ],
        (req, res) => {
            let { id } = req.params
            id = parseInt(id)
            let { name } = req.body

            var sqlUpdate = `UPDATE channels SET name = "${name}" WHERE id = "${id}"`
            conn.query(sqlUpdate, function (err, results) {
                if (err) {
                    console.log(err)
                    return res.status(400).end()
                }

                if (results.affectedRows) {
                    res.status(200).json({ results })
                } else {
                    notFoundChannel(res)
                }
            })

        }) // 채널 개별 수정

    .delete([
        param('id').notEmpty().isInt().withMessage("아이디 필요"),
        validate
    ],
        (req, res) => {
            let { id } = req.params
            id = parseInt(id)

            var sql = `DELETE FROM channels WHERE id = "${id}"`
            conn.query(sql,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        res.status(400).json(err.array())
                    }

                    if (results.affectedRows) {
                        res.status(200).json(results)
                    } else {
                        notFoundChannel(res)
                    }
                }
            )
        }) //채널 개별 삭제 

    .get([
        param('id').notEmpty().withMessage('채널id 필요'),
        validate
    ],
        (req, res) => {
            let { id } = req.params
            id = parseInt(id)

            let sql = `SELECT * FROM channels WHERE id = "${id}"`
            conn.query(sql,
                function (err, results) {

                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        notFoundChannel(res)
                    }
                }
            )
        }) //채널 개별 조회

function notFoundChannel(res) {
    res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다."
    })
}

module.exports = router