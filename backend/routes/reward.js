const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { code, body, count_available, cost } = req.body;
        if (typeof cost !== "number" || typeof count_available !== "number" || cost < 0 || count_available < 0) {
            return res.status(400).send({ message: "Bad request" });
        }
        // check if already exists
        const sameReward = await pool.query(`SELECT * FROM rewards WHERE code = '${code}' OR body = '${body}'`);
        if (sameReward.rows.length > 0) {
            return res.status(409).send({ message: "Same reward exists"});
        }
        // add the reward
        const added_reward = await pool.query(`INSERT INTO rewards(code, body, count_available, cost) VALUES('${code}', '${body}', '${count_available}', '${cost}') RETURNING *`);
        const reward_id = added_reward.rows[0].reward_id;
        return res.status(201).send({reward_id});
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const reward_res = await pool.query(`SELECT * FROM rewards WHERE count_available > 0`);
        let rewards = [];
        reward_res.rows.forEach(reward => {
            rewards.push({
                reward_id: reward.reward_id,
                code: reward.code,
                body: reward.body,
                cost: reward.cost
            });
        });
        return res.status(200).send(rewards);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
})

router.post('/buy/:id', auth, async (req, res) => {
    try {
        const { user_id } = req.userDataFromJWT;
        const reward_id = req.params.id;
        const reward_res = await pool.query(`SELECT * FROM rewards WHERE reward_id = '${reward_id}'`);
        if (reward_res.rows.length === 0) {
            return res.status(404).send({ message: "No reward found with the given id" });
        }
        const reward = reward_res.rows[0];
        if (reward.count_available === 0) {
            return res.status(404).send({ message: "Reward with the given id is exhausted" });
        }
        // Get coin balance of user
        const coin_bal_res = await pool.query(`SELECT coins FROM users WHERE user_id = '${user_id}'`);
        const coin_bal = coin_bal_res.rows[0].coins;
        if (coin_bal < reward.cost) {
            return res.status(400).send({ message: "Insufficient coin balance" });
        }
        const curr_date = new Date();
        let day = curr_date.getDate().toString();
        if (day.length === 1) {
            day = "0" + day;
        }
        let month = (curr_date.getMonth() + 1).toString();
        if (month.length === 1) {
            month = "0" + month;
        }
        const year = curr_date.getFullYear().toString();
        const buy_date = day + "/" + month + "/" + year;
        const bought_reward = await pool.query(`INSERT INTO bought_rewards(buy_date, reward_id, user_id) VALUES('${buy_date}', '${reward_id}', '${user_id}') RETURNING *`);
        const bought_reward_id = bought_reward.rows[0].bought_reward_id;
        // Deduct coin balance from user
        const updated_coin_bal = coin_bal - reward.cost;
        const new_count_available = reward.count_available - 1;
        await pool.query(`UPDATE users SET coins = '${updated_coin_bal}' WHERE user_id = '${user_id}'`);
        await pool.query(`UPDATE rewards SET count_available = ${new_count_available} WHERE reward_id = '${reward_id}'`);
        return res.status(201).send({bought_reward_id});
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
})

router.get('/bought', auth, async (req, res) => {
    try {
        const { user_id } = req.userDataFromJWT;
        const bought_rewards_res = await pool.query(`SELECT rewards.reward_id, code, body, cost, buy_date FROM bought_rewards INNER JOIN rewards ON rewards.reward_id = bought_rewards.reward_id WHERE user_id = '${user_id}'`);
        let bought_rewards = [];
        bought_rewards_res.rows.forEach(bought_reward => {
            bought_rewards.push({
                reward_id: bought_reward.reward_id,
                code: bought_reward.code,
                body: bought_reward.body,
                cost: bought_reward.cost,
                buy_date: bought_reward.buy_date
            });
        });
        return res.status(200).send(bought_rewards);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
})

module.exports = router