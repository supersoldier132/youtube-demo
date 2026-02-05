const express = require('express')
const router = express.Router()
const conn = require('../mariadb')

router.use(express.json())

router.post('/login', (req, res) => {
    const { email, password } = req.body

    let sql = `SELECT * FROM users WHERE email = "${email}"`
    conn.query(
        sql,
        function (err, results) {
            var loginUser = results[0]

            if (loginUser && loginUser.password == password) {
                res.status(200).json({
                    message: `${loginUser.name}님 로그인 되었습니다.`
                })
            } else {
                res.status(404).json({
                    message: "이메일 또는 비밀번호가 틀렸습니다."
                })
            }
        }
    )
})

router.post('/join', (req, res) => {
    if (req.body == {}) {
        res.status(400).json({
            message: '입력 값을 다시 확인해주세요'
        })
    } else {
        const { email, name, password, contact } = req.body

        let sql = `INSERT INTO users (email, name, password, contact) VALUES ("${email}", "${name}", "${password}", "${contact}")`
        conn.query(
            sql,
            function (err, results) {
                res.status(201).json(results)
            }
        )
    }
})

router
    .route('/users')
    .get((req, res) => {
        let { email } = req.body

        let sql = `SELECT * FROM users WHERE email = "${email}"`
        conn.query(
            sql,
            function (err, results) {
                if (results.length) {
                    res.status(200).json(results)
                } else {
                    res.status(400).json({
                        message: '회원 정보가 없습니다.'
                    })
                }
            }
        );
    })
    .delete((req, res) => {
        const { email } = req.body

        let sql = `DELETE FROM users WHERE email = "${email}"`
        conn.query(
            sql,
            function (err, results) {
                res.status(200).json(results)
            }
        )
    })

module.exports = router