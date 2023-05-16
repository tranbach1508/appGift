import React from 'react';
import { Icon } from '@shopify/polaris';
import { GiftCardMajor, StoreStatusMajor, BuyButtonButtonLayoutMajor, SettingsMajor, PackageMajor, EmailMajor,ShipmentMajor,DiscountsMajor } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ location }) => {
    const navigate = useNavigate();
    const menuItems = [
        {
            url: '/admin/gifts',
            icon: GiftCardMajor,
            label: "Gifts",
            submenu: null
        },
        {
            url: '/admin/goals',
            icon: StoreStatusMajor,
            label: "Goals",
            submenu: [
                {
                    url: '/admin/free-gift',
                    icon: GiftCardMajor,
                    label: "Free Gift Goals"
                },
                {
                    url: '/admin/free-shipping',
                    icon: ShipmentMajor,
                    label: "Free Shipping Goals"
                },
                {
                    url: '/admin/discount',
                    icon: DiscountsMajor,
                    label: "Discount Code Goals"
                }
            ]
        },
        {
            url: '/admin/progress-bar',
            icon: BuyButtonButtonLayoutMajor,
            label: "Progress Bar",
            submenu: null
        },
        {
            url: '/admin/recommend-popup',
            icon: PackageMajor,
            label: "Recommend Popup",
            submenu: null
        },
        {
            url: '/admin/settings',
            icon: SettingsMajor,
            label: "Settings",
            submenu: null
        },
        {
            url: '/admin/contact',
            icon: EmailMajor,
            label: "Contact",
            submenu: null
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
                                    {item.submenu != null ?
                                    <span className="Menu-Item-Icon Menu-Item-Right"><span className="Polaris-Icon Polaris-Icon--newDesignLanguage"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M13.098 8h-6.196c-.751 0-1.172.754-.708 1.268l3.098 3.432c.36.399 1.055.399 1.416 0l3.098-3.433c.464-.513.043-1.267-.708-1.267Z" /></svg></span></span>
                                    : ''}
                                </a>
                                {item.submenu != null ?
                                    <ul className="Polaris-TopBar__Submenu">
                                        {item.submenu.map((submenu) => (
                                            <li className="Polaris-TopBar__Menu-Item Submenu-Item ">
                                                <a>
                                                    <Icon
                                                        source={submenu.icon}
                                                    />
                                                    <span className="Menu-Item-Title Menu-Item-Right">{submenu.label}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul> : ''
                                }
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