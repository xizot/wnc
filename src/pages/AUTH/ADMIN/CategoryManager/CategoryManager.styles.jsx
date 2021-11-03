import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
    actionHeader:{
        display: 'flex',
        justifyContent: 'center'
    },
		buttonAdd :{
			color: '#3f51b5',
			borderColor: '#3f51b5'
		},
		topWrapOptions: {
			display: 'flex',
			justifyContent: 'left',
			paddingTop: theme.spacing(5)
		}
}));
