import React from 'react';
import { Icon } from '@shopify/polaris';
import { GiftCardMajor, StoreStatusMajor, BuyButtonButtonLayoutMajor, SettingsMajor, PackageMajor, EmailMajor } from '@shopify/polaris-icons';
import {useNavigate} from 'react-router-dom';

const TopBar = ({ location }) => {
    const navigate = useNavigate();
    const menuItems = [
        {
            url: '/admin/gifts',
            icon: GiftCardMajor,
            label: "Gifts"
        },
        {
            url: '/admin/goals',
            icon: StoreStatusMajor,
            label: "Goals"
        },
        {
            url: '/admin/progress-bar',
            icon: BuyButtonButtonLayoutMajor,
            label: "Progress Bar"
        },
        {
            url: '/admin/recommend-popup',
            icon: PackageMajor,
            label: "Recommend Popup"
        },
        {
            url: '/admin/settings',
            icon: SettingsMajor,
            label: "Settings"
        },
        {
            url: '/admin/contact',
            icon: EmailMajor,
            label: "Contact"
        }
    ]
    const changePage = (url) => {
        navigate(url);
    }
    return (
        <div className="Polaris-TopBar">
            <button type="button" className="Polaris-TopBar__NavigationIcon" aria-label="Toggle menu">
                <div className="Polaris-TopBar__IconWrapper">
                    <span className="Polaris-Icon">
                        <span className="Polaris-VisuallyHidden" />
                        <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                            <path d="M19 11h-18a1 1 0 0 1 0-2h18a1 1 0 1 1 0 2zm0-7h-18a1 1 0 0 1 0-2h18a1 1 0 1 1 0 2zm0 14h-18a1 1 0 0 1 0-2h18a1 1 0 0 1 0 2z" />
                        </svg>
                    </span>
                </div>
            </button>
            <div className="Polaris-TopBar__Contents">
                <div className="Polaris-TopBar__Custom">
                    <ul className="Polaris-TopBar__Menu">
                        {menuItems.map((item, index) =>
                        (
                            <li className={"Polaris-TopBar__Menu-Item" + (location.pathname == item.url ? " Menu-Item-Selected" : "")} key={index}>
                                <a onClick={() => changePage(item.url)}>
                                    <Icon
                                        source={item.icon}
                                    />
                                    <span className="Menu-Item-Title Menu-Item-Right">{item.label}</span>
                                </a>
                            </li>
                        )
                        )}
                    </ul>
                </div>
            </div>
        </div >
    );
};

export default TopBar;