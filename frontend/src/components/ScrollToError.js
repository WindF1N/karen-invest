import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';

export default function ScrollToError() {
    const formik = useFormikContext();
    const submitting = formik?.isSubmitting;

    useEffect(() => {
        const el = document.querySelector('.LV3Ce input[type="text"].EtdU8');
        (el?.parentElement ?? el)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [submitting]);
    return null;
}