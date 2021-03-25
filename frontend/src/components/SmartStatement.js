import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import TopCategories from './TopCategories';
import TopMerchants from './TopMerchants';

export default function SmartStatement() {
    const history = useHistory();
    const standardView = () => {
        history.goBack();
    }
    const [merchants, setMerchants] = useState([]);
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const params = location.pathname.split('/');
    const card_id = params[2];
    const getSmartDataMerchants = async () => {
        try {
            const token = await localStorage.token;
            const responseMerchants = await fetch(`http://localhost:8080/cards/${card_id}/statements/smart/merchants`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            const parseResMerchants = await responseMerchants.json();
            // console.log(parseResMerchants);
            const responseCategories = await fetch(`http://localhost:8080/cards/${card_id}/statements/smart/categories`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            const parseResCategories = await responseCategories.json();
            // console.log(parseResCategories);
            setMerchants(parseResMerchants);
            setCategories(parseResCategories);
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getSmartDataMerchants();
        // eslint-disable-next-line
    }, [])
    return (
        <>
            <button onClick={standardView}>Standard View</button>
            <h1>Smart Statement</h1>
            <TopMerchants merchants={merchants} />
            <TopCategories categories={categories} />
        </>
    )
}