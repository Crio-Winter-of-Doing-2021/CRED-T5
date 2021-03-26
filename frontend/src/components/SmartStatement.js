import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import TopCategories from './TopCategories';
import TopMerchants from './TopMerchants';

export default function SmartStatement() {
    const history = useHistory();
    const [merchants, setMerchants] = useState([]);
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const params = location.pathname.split('/');
    const card_id = params[2];
    const getSmartDataMerchants = async () => {
        try {
            const token = await localStorage.token;
            const response = await fetch(`http://localhost:8080/cards/${card_id}/statements/smart`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            const parseRes = await response.json();
            // console.log(parseRes);
            const resMerchants = parseRes.merchants_smart;
            const resCategories = parseRes.categories_smart;
            // console.log(parseResCategories);
            setMerchants(resMerchants);
            setCategories(resCategories);
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getSmartDataMerchants();
        // eslint-disable-next-line
    }, []);
    const standardView = () => {
        history.push(`/cards/${card_id}/statements`);
    }
    return (
        <>
            <button onClick={standardView}>Standard View</button>
            <h1>Smart Statement</h1>
            <TopMerchants merchants={merchants} />
            <TopCategories categories={categories} />
        </>
    )
}