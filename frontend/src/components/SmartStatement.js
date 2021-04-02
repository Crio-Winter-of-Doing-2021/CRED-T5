import React from 'react';
import { useLocation } from 'react-router';
// import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import TopCategories from './TopCategories';
import TopMerchants from './TopMerchants';

export default function SmartStatement({ searchMonth, searchYear }) {
    // const history = useHistory();
    const [merchants, setMerchants] = useState([]);
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const params = location.pathname.split('/');
    const card_id = params[2];
    const getSmartDataMerchants = async () => {
        try {
            const token = await localStorage.token;
            // console.log(searchYear + searchMonth);
            if ((searchYear + searchMonth) === '') {
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
            }
            else {
                const token = await localStorage.token;
                const response = await fetch(`http://localhost:8080/cards/${card_id}/statements/smart/${searchYear}/${searchMonth}`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
                const parseRes = await response.json();
                // console.log(parseRes);
                const resMerchants = parseRes.merchants_smart;
                const resCategories = parseRes.categories_smart;
                setMerchants(resMerchants);
                setCategories(resCategories);
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getSmartDataMerchants();
        // eslint-disable-next-line
    }, [searchMonth, searchYear]);
    // const standardView = () => {
    // history.push(`/cards/${card_id}/statements`);
    // }
    return (
        <>
            {(merchants && categories) ? (
                <div>
                    <h1>Smart Statement</h1>
                    <TopMerchants merchants={merchants} />
                    <TopCategories categories={categories} /></div>
            ) : (
                <p>No statements found for entered month and year</p>
            )
            }
        </>
    )
}