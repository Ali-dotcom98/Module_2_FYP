import moment from "moment";
import html2canvas from "html2canvas"
export const formatYearMonth = (yearMonth) => {
    return yearMonth ? moment(yearMonth).format("Do MMM YYYY") : "";
}



export const fixTailwindColors = (element) => {
    const elements = element.querySelectorAll("*");
    elements.forEach((el) => {
        const style = window.getComputedStyle(el);

        ["color", "backgroundColor", "borderColor"].forEach((prop) => {
            const value = style[prop];

            if (value.startsWith("oklch")) {
                try {
                    // Let the browser convert oklch() to rgb
                    const temp = document.createElement("div");
                    temp.style.color = value;
                    document.body.appendChild(temp);
                    const rgb = window.getComputedStyle(temp).color;
                    document.body.removeChild(temp);

                    el.style[prop] = rgb; // assign safe rgb value
                } catch (err) {
                    el.style[prop] = "#000"; // fallback
                }
            }
        });
    });
};

// Convert component to image
export async function captureElementAsImage(element) {
    if (!element) throw new Error("No element provided");
    const canvas = await html2canvas(element);
    return canvas.toDataURL("image/png");
}

// Utility to convert base64 data URL to a File object
export const dataURLtoFile = (dataUrl, fileName) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
}; 