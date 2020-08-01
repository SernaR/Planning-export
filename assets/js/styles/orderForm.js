import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: theme.spacing(2), 
        paddingLeft:theme.spacing(2),
        paddingRight: theme.spacing(2),
        minHeight: '100%'
    },
    card2: {
        marginTop: theme.spacing(3),
        paddingLeft:theme.spacing(2),
        paddingRight: theme.spacing(2),
        minHeight: '100%',
        position: 'relative'
    },
    label:{
        fontWeight: 'bold',
   },
    label2:{
        fontWeight: 'bold',
        marginTop: theme.spacing(1),
    },
   span: {
       fontWeight: 'normal',
       paddingLeft: theme.spacing(2)
   },
   title: {
       paddingBottom: theme.spacing(4),
       textAlign: 'center',
       fontSize: '2em'
   },
   cardActions: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(4),
    }
}))