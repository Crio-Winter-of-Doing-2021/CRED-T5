import React from 'react';
import Category from './Category';
export default function TopCategories({ categories }) {
    return (
        <div style={{ border: "1px solid black" }}>
            <h2>Top categories</h2>
            <ul>
                {categories.map((category) => {
                    return <Category key={category.category} category={category} />
                })}
            </ul>
        </div>
    )
}