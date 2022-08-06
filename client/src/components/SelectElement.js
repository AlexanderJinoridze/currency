import React, { useState, useEffect, useRef } from "react";
import { includes, find, findIndex } from 'lodash';

export default function SelectElement(props) {
    const [dropDownOn, setDropDownOn] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [options, setOptions] = useState();
    const [value, setValue] = useState();
    const [selectedOption, setSelectedOption] = useState();

    const selectContainer = useRef(null);
    const optionsList = useRef(null);

    const getOption = (value, collection) => find(collection, (option) => option.value === value)

    const scrollIntoViewIfNeeded = (child, container) => {
        let childOffsetTop = child.offsetTop;
        let containerScrollTop = container.scrollTop;

        if ((childOffsetTop + child.clientHeight) >= (containerScrollTop + container.clientHeight)) {
            child.scrollIntoView(false);
        }
        else if (childOffsetTop <= containerScrollTop) {
            child.scrollIntoView();
        }
    }

    const handleChange = (value) => {
        setDropDownOn(false);
        setSelectedOption(getOption(value, props.options));
        props.onChange(value);
    }

    const handleClickOutside = (e) => {
        if (!selectContainer.current.contains(e.target)){
            setDropDownOn(false)
        }
    }

    const handleKeyDown = (e) => {
        const keyCode = e.keyCode;

        if(keyCode === 13) {
            handleChange(value);
        }

        if(keyCode === 38 || keyCode === 40) {
            let selectedIndex;
            let selectedValue;
            let prevIndex = findIndex(options, (option) => option.value === value );
            let parent = optionsList.current;
            let lastIndex = options.length - 1;

            if(keyCode === 38) {
                selectedIndex = prevIndex - 1;
            }
            
            if(keyCode === 40) {
                selectedIndex = prevIndex + 1;
            }

            if(selectedIndex < 0) {
                selectedIndex = lastIndex;
            }

            if(selectedIndex > lastIndex) {
                selectedIndex = 0;
            }

            selectedValue = options[selectedIndex].value;

            setValue(selectedValue);
            scrollIntoViewIfNeeded(parent.querySelector(`[data-value=${ selectedValue }]`), parent);
        }
    }

    const handleBlur = (e) => {
        if (e.relatedTarget && !selectContainer.current.contains(e.relatedTarget)) {
            setDropDownOn(false);
        }
    }

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        }
    }, [value]);

    useEffect(() => {
        let initOptions = props.options;

        setOptions(initOptions);
        initOptions.length && setValue(initOptions[0].value);
        setSelectedOption(getOption(props.value, initOptions));
    }, [props]);

    useEffect(() => {
        setSearchValue("");
    }, [dropDownOn]);

    useEffect(() => {
        let searchResults = [];
        props.options.map((option) => includes(`${ option.value } ${ option.label }`.toLowerCase(), searchValue.toLowerCase()) && searchResults.push(option));
        setOptions(searchResults);
        searchResults.length && setValue(searchResults[0].value);
    }, [props, searchValue]);

    return(
        <div ref={ selectContainer } onKeyDown={ handleKeyDown } className="is-relative">
            { dropDownOn?
                <>
                    <div className="field m-0 has-addons">
                        <div className="control is-flex-grow-1">
                            <input
                                type="text"
                                className="input"
                                autoFocus
                                value={ searchValue }
                                onChange={ (e) => setSearchValue(e.target.value) }
                                onFocus={ () => setDropDownOn(true) }
                                onBlur={ handleBlur }
                            />
                        </div>
                        <div className="control">
                            <button
                                className="button"
                                onClick = { () => setDropDownOn(false) }
                                onBlur = { handleBlur }
                                onKeyDown = {
                                    (e) => {
                                        e.keyCode === 13 && setDropDownOn(false);
                                        e.stopPropagation();
                                    }
                                }
                            >
                                <span className="icon is-small">
                                    <i className="icon-x"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div ref={ optionsList } className="dropdown-menu">
                        {
                            options.length?
                                options.map((option, optionIndex) =>
                                    <div
                                        key={ optionIndex }
                                        data-value={ option.value }
                                        className={ `dropdown-item ${option.value === value? "selected" : ""}` }
                                        onMouseEnter={ () => setValue(option.value) }
                                        onClick={ () => handleChange(option.value) }
                                    >
                                        { props.drawOption(option.value, option.label) }
                                    </div>
                                )
                            :
                                <div className="p-3">No results</div>
                        }
                    </div>
                </>
                :
                <div
                    tabIndex="0"
                    className="is-clickable"
                    onClick={ () => setDropDownOn(true) }
                    onFocus={ () => setDropDownOn(true) }
                >
                    {
                        props.drawButton?
                            props.drawButton()
                        :
                        <div className="control has-icons-right">
                            <div className="input dropdown-item">
                                { selectedOption && props.drawOption( selectedOption.value, selectedOption.label ) }
                            </div>
                            <span className="icon is-small is-right">
                                <i className="icon-angle-down"></i>
                            </span>
                        </div>
                    }
                </div>
            }
        </div>
    )
}