import moment from "moment";
import { toast } from "react-toastify";

export const getDifference = (newValue, currentValue) => {
    return newValue.filter((newVal) => {
        return currentValue.length > 0 ? currentValue.some((oldVal) => {
            return newVal.analysis_id === oldVal.analysis_id;
        }) : true;
    });
};

const removeAllInstances = (it, arr) => {
    let i = 0;
    while (i < arr.length) {
      if (arr[i] === it) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  };

export const beautifyName = (s) => {
    return s
      ? removeAllInstances("", s.split("_"))
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(" ")
      : null;
  };

export const camelCase = (s) => {
    return s ? s[0].toUpperCase() + s.slice(1) : null ;
}

export const formatDate = (date) => moment(date).format("DD/MM/YYYY HH:mm:ss A");

export const sortByDate = (array) => {
  array.sort(function(a,b){
    return  moment(b.date).format('YYYYMMDD')-moment(a.date).format('YYYYMMDD')
  });
  return array;
}

const options = {
  hideProgressBar: true,
}

export const showSuccessToast = (message) => toast.success(message, options)

export const showErrorToast = (message) => toast.error(message, options)