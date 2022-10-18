const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    getAddress: async (req, res) => {
        try {
            // console.log(req.dataToken);
            let getSql = await dbQuery(`SELECT a.*, s.*, u.fullname, u.phone_number FROM address a 
            JOIN status s ON a.status_id = s.idstatus 
            JOIN user u ON u.iduser = a.user_id 
            WHERE a.user_id = ${req.dataToken.iduser};`)
            console.log(getSql)

            res.status(200).send(getSql);
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },

    addAddress: async (req, res) => {
        try {

            // console.log(req.body.data)
            const { full_address, district, city, city_id, province, province_id, postal_code } = req.body.data;

            await dbQuery(`INSERT INTO address (full_address, district, city, city_id, province, province_id, postal_code, user_id) VALUES
          (${dbConf.escape(full_address)}, ${dbConf.escape(district)}, ${dbConf.escape(city)}, ${dbConf.escape(city_id)}, ${dbConf.escape(province)}, ${dbConf.escape(province_id)}, ${dbConf.escape(postal_code)}, ${dbConf.escape(req.dataToken.iduser)});`)

            res.status(200).send({
                success: true,
                message: "Address Added Success"
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }
    },

    updateAddress: async (req, res) => {
        try {
            console.log(req.body)
            if (req.body.selected) {
                await dbQuery(`UPDATE address SET selected='false' WHERE user_id = ${dbConf.escape(req.dataToken.iduser)};`);
                await dbQuery(`UPDATE address SET selected=${dbConf.escape(req.body.selected)} WHERE idaddress = ${dbConf.escape(req.body.idaddress)};`);
            } else if (req.body.dataEdit) {
                let data = req.body.dataEdit;

                let temp = [];
                for (let key in data) {
                    console.log(key, data[key]);
                    if (data[key] != 0 || data[key] != '') {
                        temp.push(`${key} = ${dbConf.escape(data[key])}`)
                    }
                }
                //console.log(temp.join(' , '));

                await dbQuery(`UPDATE address SET ${temp.join(' , ')} WHERE idaddress = ${dbConf.escape(req.body.idaddress)} AND user_id = ${req.dataToken.iduser};`);
            } else if (req.body.setPrimary) {
                await dbQuery(`UPDATE address SET selected='false' WHERE user_id = ${dbConf.escape(req.dataToken.iduser)};`);
                await dbQuery(`UPDATE address SET status_id=11 WHERE user_id = ${dbConf.escape(req.dataToken.iduser)};`);
                await dbQuery(`UPDATE address SET status_id=10 WHERE idaddress = ${dbConf.escape(req.body.setPrimary)};`);
                await dbQuery(`UPDATE address SET selected='true' WHERE idaddress = ${dbConf.escape(req.body.setPrimary)};`);
                
            }

            res.status(200).send({
                success: true,
                message: "Address Updated"
            })

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },

    deleteAddress: async (req, res) => {
        try {
            //console.log(req.params);
            await dbQuery(`DELETE from address WHERE idaddress = ${dbConf.escape(req.params.idaddress)};`);

            res.status(200).send({
                success: true,
                message: "Address Deleted"
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
};