const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    getProduct: (req, res) => {

        let { query, sort, filterName } = req.body;

        // tambah join stock
        dbConf.query(`Select * from product join stock on stock.product_id = product.idproduct
        ${filterName ? `where product_name like ('%${filterName}%')` : ''} 
        order by ${sort ? `${sort}` : `idproduct`} 
        ${query ? `asc limit ${dbConf.escape(query)}` : ''};`,
            (err, results) => {
                if (err) {
                    return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                }
                res.status(200).send(results);
            })
    },
    filterProduct: (req, res) => {
        let filterCategory = req.query.category_id;
        let { query, sort, filterName } = req.body;
        if (JSON.stringify(filterName) != '{}') {
            `and category_id = ${filterCategory}`
        } else {
            `where category_id = ${filterCategory}`
        }

        dbConf.query(`Select * from product 
        ${filterCategory ? `where category_id=${filterCategory}` : ''}
        ${filterName ? `and product_name like ('%${filterName}%')` : ''} 
        order by ${sort ? `${sort}` : `idproduct`} asc 
        limit ${dbConf.escape(query)}`,
            (err, results) => {
                if (err) {
                    return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                }

                res.status(200).send(results);
            })
    },
    getProductAdmin: (req, res) => {
        let filterCategory = req.query.category_id;
        let product_name = req.query.product_name;
        let { limit, sort, offset } = req.body;

        if (filterCategory) {
            if (filterCategory[1]) {

                let resultFilter = filterCategory.map((val, idx) => {
                    if (idx == 0) {
                        return `(category_id = ${val}`
                    } else if (idx == (filterCategory.length - 1)) {
                        if (JSON.stringify(product_name) == '{}') {
                            return `or category_id = ${val})`
                        } else {
                            return `or category_id = ${val})`
                        }
                    } else {
                        if (JSON.stringify(product_name) == '{}') {
                            return `or category_id = ${val}`
                        } else {
                            return `or category_id = ${val}`
                        }
                    }
                })

                dbConf.query(`Select p.*, c.category_name, s.stock_unit from product p join category c on c.idcategory = p.category_id join stock s on p.idproduct=s.product_id
                ${filterCategory || product_name ? 'where' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter.join(' ') : ''}
                order by ${sort ? `${sort} asc` : `idproduct desc`} 
                limit 10 offset ${dbConf.escape(offset)}`,
                    (err, results) => {
                        if (err) {
                            return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                        }

                        res.status(200).send(results);
                    })
            } else {
                let resultFilter = `category_id=${filterCategory}`;

                dbConf.query(`Select p.*, c.category_name, s.stock_unit from product p join category c on c.idcategory = p.category_id join stock s on p.idproduct=s.product_id
                ${filterCategory || product_name ? 'where' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter : ''}
                order by ${sort ? `${sort} asc` : `idproduct desc`} 
                ${typeof offset == typeof 'string' ? `limit ${dbConf.escape(limit)}` : `limit 10 offset ${dbConf.escape(offset)}`}`,
                    (err, results) => {
                        if (err) {
                            return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                        }

                        res.status(200).send(results);
                    })
            }
        } else {
            let resultFilter = `category_id=${filterCategory}`;

            dbConf.query(`Select p.*, c.category_name, s.stock_unit from product p join category c on c.idcategory = p.category_id join stock s on p.idproduct=s.product_id
                ${filterCategory || product_name ? 'where' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter : ''}
                order by ${sort ? `${sort} asc` : `idproduct desc`} 
                ${typeof offset == typeof 'string' ? `limit ${dbConf.escape(limit)}` : `limit 10 offset ${dbConf.escape(offset)}`}`,
                (err, results) => {
                    if (err) {
                        return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                    }

                    res.status(200).send(results);
                })
        }
    },
    addProduct: (req, res, next) => {
        let image = `/imgProductPict/${req.files[0].filename}`;
        let { product_name, price, category_id, netto_stock, netto_unit, default_unit, description, dosis, aturan_pakai, stock_unit } = JSON.parse(req.body.data);

        dbConf.query(`Insert into product (product_name, price, category_id, netto_stock, netto_unit, default_unit, picture, description, dosis, aturan_pakai) 
        values (${dbConf.escape(product_name)},${dbConf.escape(price)},${dbConf.escape(category_id)},${dbConf.escape(netto_stock)},${dbConf.escape(netto_unit)},${dbConf.escape(default_unit)},${dbConf.escape(image)},${dbConf.escape(description)},${dbConf.escape(dosis)},${dbConf.escape(aturan_pakai)})`,
            (err, results) => {
                if (err) {
                    return res.status(500).send(`Middlewear addProduct failed, error : ${err}`)
                }

                dbConf.query(`Select idproduct from product where product_name='${product_name}'`,
                    (e, r) => {
                        if (e) {
                            return res.status(500).send(`Middlewear addProduct failed, error : ${e}`)
                        }

                        resultAddproduct = {
                            product_id: r[0].idproduct,
                            stock_unit,
                            unit: default_unit
                        };

                        next()

                    })
            })
    },
    addStock: (req, res) => {
        let { product_id, stock_unit, unit } = resultAddproduct;

        dbConf.query(`Insert into stock (stock_unit, unit, isDefault, product_id)
        values (${dbConf.escape(stock_unit)},${dbConf.escape(unit)},'true',${dbConf.escape(product_id)})`),
            (error, results) => {
                if (err) {
                    return res.status(500).send(`Middlewear addProduct failed, error : ${error}`)
                }
                res.status(200).send(results)
            }
    },
    stockHistory: (req, res, next) => {
        let idproduct = req.params.id;
        dbConf.query(`Select *,p.product_name from stock s join product p on s.product_id = p.idproduct where s.product_id = ${idproduct} and s.isDefault ='true';`,
            (err, results) => {
                if (err) {
                    return res.status(500).send(`Middlewear stockHistory failed, error : ${err}`)
                }
                if (results[0].stock_unit > req.body.data.stock_unit) {
                    dbConf.query(`INSERT INTO history_stock (product_name, user_id,unit,quantity, type,information) VALUES
                    (${dbConf.escape(results[0].product_name)},${dbConf.escape(req.body.data.iduser)},${dbConf.escape(results[0].unit)},${dbConf.escape(results[0].stock_unit - req.body.data.stock_unit)},'Manual Update','Pengurangan');`,
                        (error, results) => {
                            if (error) {
                                return res.status(500).send(`Middlewear stockHistory failed, error : ${error}`)
                            }
                            next()
                        })
                } else if (results[0].stock_unit < req.body.data.stock_unit) {
                    dbConf.query(`INSERT INTO history_stock (product_name, user_id,unit,quantity, type,information) VALUES
                (${dbConf.escape(results[0].product_name)},${dbConf.escape(req.body.data.iduser)},${dbConf.escape(results[0].unit)},${dbConf.escape(req.body.data.stock_unit - results[0].stock_unit)},'Manual Update','Penambahan');`,
                        (error, results) => {
                            if (error) {
                                return res.status(500).send(`Middlewear stockHistory failed, error : ${error}`)
                            }
                            next()
                        })
                }
            })
    },
    deleteProduct: (req, res) => {
        let idproduct = req.params.id;

        dbConf.query(`Delete from product where idproduct=${dbConf.escape(idproduct)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(`Middlewear query delete gagal : ${error}`);
                }

                if (results.affectedRows) {
                    res.status(200).send(
                        {
                            message: true
                        })
                } else {
                    res.status(200).send(
                        {
                            message: false
                        })
                }

            })
    },
    editProduct: (req, res) => {
        let idproduct = req.params.id;
        let image = `/imgProductPict/${req.files[0].filename}`;
        let { price, category_id, netto_stock, netto_unit, default_unit, description, dosis, aturan_pakai, stock_unit, unit } = JSON.parse(req.body.data);

        dbConf.query(`UPDATE product p, stock s
        SET p.price=${dbConf.escape(price)},
            p.category_id=${dbConf.escape(category_id)},
            p.netto_stock=${dbConf.escape(netto_stock)},
            p.netto_unit=${dbConf.escape(netto_unit)},
            p.default_unit=${dbConf.escape(default_unit)},
            p.picture=${dbConf.escape(image)},
            p.description=${dbConf.escape(description)},
            p.dosis=${dbConf.escape(dosis)},
            p.aturan_pakai=${dbConf.escape(aturan_pakai)},
            s.stock_unit=${dbConf.escape(stock_unit)},
            s.unit=${dbConf.escape(unit)}
        WHERE
            p.idproduct = ${dbConf.escape(idproduct)}
            AND s.product_id = ${dbConf.escape(idproduct)} AND s.isDefault = 'true' `,
            (error, results) => {
                if (error) {
                    res.status(500).send(`Middleware query edit product gagal :`, error);
                }

                res.status(200).send(results);
            })
    },
    getCategory: (req, res) => {
        dbConf.query(`Select * from category`,
            (err, results) => {
                if (err) {
                    return res.status(500).send('Middlewear getCategory failed, error :', err)
                }

                res.status(200).send(results);
            })
    },
    getUnit: (req, res) => {
        let unit_type = req.query.unit_type;

        dbConf.query(`Select * from unit where unit_type=${dbConf.escape(unit_type)}`,
            (err, results) => {
                if (err) {
                    return res.status(500).send('Middlewear getUnit failed. Error :', err)
                }
                res.status(200).send(results);
            })
    },
    addUnit: (req, res) => {
        let unit_type = req.query.unit_type;
        let unit = req.body.unit;

        console.log(unit_type)
        console.log(unit)

        dbConf.query(`Select * from unit where unit=${dbConf.escape(unit)} `,
            (err, results) => {
                if (err) {
                    return res.status(500).send('Middlewear getUnit failed. Error :', err)
                }

                console.log(results)

                if (JSON.stringify(results) != '[]') {
                    res.status(200).send({
                        message: false
                    })
                } else {
                    console.log(`Insert into unit (unit_type, unit) values (${dbConf.escape(unit_type)}, ${dbConf.escape(unit)})`)
                    dbConf.query(`Insert into unit (unit_type, unit) values (${dbConf.escape(unit_type)}, ${dbConf.escape(unit)})`,
                        (err, results) => {
                            if (err) {
                                res.status(500).send('Middlewear addUnit failed:', err)
                            }
                            res.status(200).send({
                                ...results,
                                message: true
                            });
                        })
                }
            })
    },
    deleteUnit: (req, res) => {
        let idunit = req.params.id;

        dbConf.query(`Delete from unit where idunit=${dbConf.escape(idunit)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(`Middlewear query delete gagal : ${error}`);
                }

                if (results.affectedRows) {
                    res.status(200).send(
                        {
                            message: true
                        })
                } else {
                    res.status(200).send(
                        {
                            message: false
                        })
                }

            })
    },
    addCategory: (req, res) => {
        let category_name = req.body.category_name;

        dbConf.query(`Select * from category where category_name=${dbConf.escape(category_name)}`,
            (err, results) => {
                if (err) {
                    res.send(500).status('Middlewear addCategory gagal :', error)
                }

                if (JSON.stringify(results) != '[]') {
                    res.status(200).send({
                        message: false
                    })
                } else {
                    dbConf.query(`Insert into category (category_name) values (${dbConf.escape(category_name)})`,
                        (err, results) => {
                            if (err) {
                                res.send(500).status('Middlewear addCategory gagal :', error)
                            }

                            res.status(200).send({
                                ...results,
                                message: true
                            })
                        })
                }
            })
    },
    editCategory: (req, res) => {
        let idcategory = req.params.id;
        let category_name = req.body.category_name;

        dbConf.query(`Update category set category_name=${dbConf.escape(category_name)} where idcategory=${dbConf.escape(idcategory)}`,
            (err, results) => {
                if (err) {
                    res.status(500).send('Middlewear editcategory gagal :', err)
                }
                console.log(results)
                res.send(200).status({
                    ...results,
                    message: true
                })
            })
    },
    deleteCategory: (req, res) => {
        let idcategory = req.params.id;

        dbConf.query(`Delete from category where idcategory=${dbConf.escape(idcategory)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(`Middlewear query delete gagal : ${error}`);
                }

                if (results.affectedRows) {
                    res.status(200).send(
                        {
                            message: true
                        })
                } else {
                    res.status(200).send(
                        {
                            message: false
                        })
                }

            })
    },
    getcartdata: async (req, res) => {
        try {
            let getSql = await dbQuery(`SELECT * FROM cart c 
            JOIN product p ON c.product_id = p.idproduct 
            JOIN stock s ON s.product_id = p.idproduct
            WHERE c.user_id = ${dbConf.escape(req.dataToken.iduser)};`);

            res.status(200).send(getSql);

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    deletecart: async (req, res) => {
        try {
            console.log(req.params)
            await dbQuery(`DELETE FROM cart WHERE idcart=${dbConf.escape(req.params.idcart)};`);

            res.status(200).send({
                success: true,
                message: 'Delete Success'
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    updatecart: async (req, res) => {
        try {
            //console.log(req.body)
            if (req.body.selected) {
                if (req.body.selectAll) {
                    // checkbox all
                    await dbQuery(`UPDATE cart SET selected=${dbConf.escape(req.body.selected)} WHERE user_id = ${dbConf.escape(req.dataToken.iduser)};`);
                } else {
                    // checkbox satu item
                    await dbQuery(`UPDATE cart SET selected=${dbConf.escape(req.body.selected)} WHERE idcart=${dbConf.escape(req.body.idcart)};`);
                }
            } else {
                await dbQuery(`UPDATE cart SET quantity=${dbConf.escape(req.body.newQty)} WHERE idcart=${dbConf.escape(req.body.idcart)};`);
            }

            res.status(200).send({
                success: true,
                message: 'Update Success'
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    addCart: async (req, res) => {
        try {
            // console.log(req.body);
            // console.log(req.dataToken);

            // single income data
            await dbQuery(`INSERT INTO cart (user_id, product_id, quantity) VALUES (${dbConf.escape(req.dataToken.iduser)}, ${dbConf.escape(req.body.idproduct)}, ${dbConf.escape(req.body.newQty)});`);

            res.status(200).send({
                success: true,
                message: 'Product Added'
            })

        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    unitConv: async (req, res) => {
        try {
            console.log(req.body)
            if (req.body.status == 'already') {
                await dbQuery(`UPDATE stock SET stock_unit=${dbConf.escape(req.body.main)} WHERE product_id=${dbConf.escape(req.body.idproduct)} AND isDefault='true';`);
                await dbQuery(`UPDATE stock SET stock_unit=${dbConf.escape(req.body.conv)} WHERE product_id=${dbConf.escape(req.body.idproduct)} AND isDefault='false';`);
                await dbQuery(`INSERT INTO history_stock (product_name, user_id,unit,qty, type,information) VALUES
                (${dbConf.escape(req.body.name)},${dbConf.escape(req.body.iduser)},${dbConf.escape(req.body.mainUnit)},${dbConf.escape(req.body.change_main)},'Unit Conversion','Pengurangan'),
                (${dbConf.escape(req.body.name)},${dbConf.escape(req.body.iduser)},${dbConf.escape(req.body.convUnit)},${dbConf.escape(req.body.change_conv)},'Unit Conversion','Penambahan');`)
            } else {
                await dbQuery(`UPDATE stock SET stock_unit=${dbConf.escape(req.body.main)} WHERE product_id=${dbConf.escape(req.body.idproduct)} AND isDefault='true';`);
                await dbQuery(`insert into stock (stock_unit,unit,isDefault,product_id) values (${dbConf.escape(req.body.conv)},${dbConf.escape(req.body.convUnit)},'false',${dbConf.escape(req.body.idproduct)});`);
                await dbQuery(`INSERT INTO history_stock (product_name, user_id,unit,qty, type,information) VALUES
                (${dbConf.escape(req.body.name)},${dbConf.escape(req.body.iduser)},${dbConf.escape(req.body.mainUnit)},${dbConf.escape(req.body.change_main)},'Unit Conversion','Pengurangan'),
                (${dbConf.escape(req.body.name)},${dbConf.escape(req.body.iduser)},${dbConf.escape(req.body.convUnit)},${dbConf.escape(req.body.conv)},'Unit Conversion','Penambahan');`)
            }
            res.status(200).send({
                success: true,
                message: 'Unit Conversion Success'
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
};
