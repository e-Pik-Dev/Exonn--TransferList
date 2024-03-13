import * as React from 'react';
import {runInAction} from "mobx";
import {observer, useLocalObservable} from "mobx-react-lite"

import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {
    Grid, Paper, Box,
    List, ListItemButton, ListItemIcon, ListItemText,
    InputBase, IconButton, Checkbox, Button,
    Divider,

} from '@mui/material'

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';

import {
    IconCheckBox, IconCheckBoxChecked,
    IconCheckBoxCollapseCollapsed, IconCheckBoxCollapseShown,
    IconDisk as SaveDisk,
    IconFiRsArrowSmallLeft as ArrowLeft,
    IconFiRsArrowSmallRight as ArrowRight,
    IconSearch as Search
} from '../assets/transfer-list/icons-exsonn'

const saveButtonSx = {
    my: '5px', mx: 0, p: 0,
    minWidth: 35, minHeight: 35,
    borderRadius: "6px",
}

const iconButtonIconSx = {color: 'black'}
const iconButtonSx = {
    ...saveButtonSx,
    border: '1px solid',
    borderColor: '#8D9AA8'
}

const containerSx = {height: 335}
const customListSx = {width: 240, overflow: 'hidden', boxSizing: 'border-box'}

const listSx = {
    width: 240,
    height: 225,
    overflow: 'auto',
    ml: '-1px'
}

let ExonnTheme = createTheme({})

ExonnTheme = createTheme({
    typography: {
        fontFamily: [
            "Poppins",
            "Roboto"
        ].join(', '),
        color: "#343434",
        fontWeight: 400,
    },
    palette: {
        green: ExonnTheme.palette.augmentColor({
            color: {
                main: '#36AD82',
            },
            name: 'green',
        }),
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid',
                    borderColor: '#AEB6CE33',
                    borderRadius: '6px',
                    height: 335,
                    backgroundColor: '#FEFEFE',
                    margin: '1px 0',
                    // this stinky things are applied to account for borders
                    '& > *': {margin: '0px -1px'},
                }
            }
        },
        MuiList: {
            styleOverrides: {
                root: {
                    padding: "0",

                    '& .MuiListItemButton-root:first-of-type': {
                        marginTop: '15px',
                    },

                    // custom scroll styling,
                    // yes, !important is ugly, but those values are applied dynamically via styles,
                    // so its only way to override them
                    '& .ScrollBar-track-vertical': {
                        position: 'absolute',
                        width: '17px !important',
                        right: '0px',
                        bottom: '5px',
                        top: '0px',
                        paddingTop: '5px',
                        borderLeft: '1px solid',
                        borderColor: '#AEB6CE33',
                        backgroundColor: "#FEFEFE",
                    },
                    // hide track when container is not overflown, by looking for thumb height
                    '& .ScrollBar-track-vertical:has([style*="height: 0"])': {
                        visibility: 'hidden'
                    },
                    '& .ScrollBar-thumb-vertical': {
                        position: 'relative',
                        display: 'block',
                        width: '6px !important',
                        left: '5px !important',
                        cursor: 'pointer',
                        borderRadius: '40px',
                        backgroundColor: '#7F858D4D',
                        transform: 'translateY(0px)',
                    }
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    height: '33px',
                    margin: '10px 0px',
                }
            }
        },
        MuiIconButton: {
            defaultProps: {
                root: {
                    backgroundColor: 'transparent',
                }
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    "&[disabled]": {
                        opacity: 0.5
                    },
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: "#AEB6CE33"
                }
            }
        },
        MuiScopedCssBaseline: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                }
            }
        }
    }
});

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const Exonn__TransferList = observer(({itemListLeft: left, itemListRight: right, onSave}) => {

    // checked items state
    const checkedState = useLocalObservable(() => ({
            items: [],
        })
    )

    const leftChecked = intersection(checkedState.items, left);
    const rightChecked = intersection(checkedState.items, right);

    const setLeft = (items) => runInAction(() => left.splice(0, left.length, ...items))
    const setRight = (items) => runInAction(() => right.splice(0, right.length, ...items))

    const handleToggle = (value) => () => {
        const currentIndex = checkedState.items.indexOf(value);
        const newChecked = [...checkedState.items];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        runInAction(() => checkedState.items = newChecked)
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked))
        setLeft(not(left, leftChecked))

        runInAction(() => checkedState.items = not(checkedState.items, leftChecked))
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked))
        setRight(not(right, rightChecked))

        runInAction(() => checkedState.items = not(checkedState.items, rightChecked))
    };


    return (
        <ThemeProvider theme={ExonnTheme}>
            <ScopedCssBaseline>
                <Grid container sx={containerSx} rowSpacing="0" columnSpacing="10px" justifyContent="center"
                      alignItems="center">
                    <Grid item>
                        <CustomList items={left}
                                    title="Not ben. Attributes"
                                    checkedItems={checkedState.items}
                                    handleToggle={handleToggle}
                        />
                    </Grid>

                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <IconButton
                                sx={iconButtonSx}
                                size="small"
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                <ArrowLeft fontSize="inherit" sx={iconButtonIconSx}/>
                            </IconButton>

                            <IconButton
                                sx={iconButtonSx}
                                variant="outlined"
                                size="small"
                                color="inherit"
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                <ArrowRight fontSize="inherit" sx={iconButtonIconSx}/>
                            </IconButton>

                            <Button
                                sx={saveButtonSx}
                                disableElevation={true}
                                variant="contained"
                                color="green"
                                size="small"
                                onClick={onSave}
                                aria-label="save selection"
                            >
                                <SaveDisk/>
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <CustomList
                            items={right}
                            title="Item has this attrib."
                            checkedItems={checkedState.items}
                            handleToggle={handleToggle}
                        />
                    </Grid>
                </Grid>
            </ScopedCssBaseline>
        </ThemeProvider>
    )
})

const ListHeader = observer(({title, headerState, onSearch}) => {

    return (
        <Box sx={{pt: "15px", pb: "14px"}}>

            {/* collapse button */}
            <ListItemButton
                role="listitem"
                sx={{m: 0, pl: '10px'}}
                onClick={() => headerState.toggleCollapse()}
            >
                <ListItemIcon
                    sx={{minWidth: "auto"}}
                >
                    <Checkbox
                        sx={{p: "10px"}}
                        checked={headerState.isCollapsed}
                        tabIndex={-1}
                        icon={<IconCheckBoxCollapseShown/>}
                        checkedIcon={<IconCheckBoxCollapseCollapsed/>}
                        disableRipple
                        inputProps={{'aria-labelledby': `labelId_${title}`}}
                    />
                </ListItemIcon>
                <ListItemText
                    id={`labelId_${title}`}
                    sx={{'& .MuiTypography-root': {fontWeight: 600}}}
                    primary={title}
                />
            </ListItemButton>

            {/* search box */}
            <Box sx={{
                display: headerState.isCollapsed ? "none" : "flex",
                border: "1px solid",
                borderRadius: "6px",
                borderColor: '#AEB6CE4D',
                margin: '6px 20px 0px',
                height: '40px',
            }}
            >
                <IconButton
                    sx={{padding: "13px 11px"}}
                >
                    <Search/>
                </IconButton>
                <InputBase
                    sx={{
                        color: "#7F858D",
                        fontSize: "14px",
                        "& .MuiInputBase-input::placeholder": {opacity: 1}
                    }}
                    variant="outlined"
                    placeholder="Search..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </Box>
        </Box>
    )
})

const CustomList = observer(({title, items, checkedItems, handleToggle}) => {

    // header collapse state
    const headerState = useLocalObservable(() => ({
            isCollapsed: false,
            toggleCollapse() {
                this.isCollapsed = !this.isCollapsed
            }
        })
    )

    // object to show and filter passed items (via string from search field)
    const filterableItems = useLocalObservable(() => ({
            filterString: '',
            get items() {
                // show all items if there is nothing to filter with
                if (!this.filterString) {
                    return items
                }

                // filter items by value, assuming they are strings
                // use case insensitive search
                const string = this.filterString.toLowerCase()

                return items.filter(item => item.toLowerCase().includes(string))
            },
            filter(filterString) {
                this.filterString = filterString
            },
    }))

    return (
        <Paper sx={customListSx} elevation={0}>
            <ListHeader {...{title, headerState, onSearch: filterableItems.filter}}/>
            <Divider/>
            <List
                sx={{
                    ...listSx,
                    // 33 + 12 is the height + my of search field, TODO define it elsewhere
                    height: !headerState.isCollapsed ? listSx.height : listSx.height + 33 + 12
                }}
                dense component="div" role="list"
            >
                {/* non-native, react custom scrollbar */}
                <Scrollbars
                    renderTrackVertical={props => <div {...props} className="ScrollBar-track-vertical"/>}
                    renderThumbVertical={props => <div {...props} className="ScrollBar-thumb-vertical"/>}
                >
                    {filterableItems.items.map((value) => {
                        const labelId = `transfer-list-item-${value}-label`;

                        return (
                            <ListItemButton
                                key={value}
                                role="listitem"
                                onClick={handleToggle(value)}
                                sx={{py: 0, pl: "10px"}}
                            >
                                <ListItemIcon
                                    sx={{minWidth: "auto"}}
                                >
                                    <Checkbox
                                        sx={{p: "10px"}}
                                        checked={checkedItems.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        icon={<IconCheckBox/>}
                                        checkedIcon={<IconCheckBoxChecked/>}
                                        disableRipple
                                        inputProps={{'aria-labelledby': labelId}}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId}
                                              primary={value}
                                />
                            </ListItemButton>
                        );
                    })}
                </Scrollbars>
            </List>
        </Paper>
    );
})

export default Exonn__TransferList
