import React from "react";
import './Radio.css';

type props = {
    legend: string;
    note?: string;
    options: string[];
    bind: [any, React.Dispatch<React.SetStateAction<any>>];
}

/**
 * Un input de tipo radio.
 * @param legend - El título del input.
 * @param note - Nota extra acerca del input.
 * @param options - Array de valores, uno para cada radio.
 * @param bind - Array desestructurado asociado al valor del input.
 */
export default function Radio({ legend = "", note, options, bind }: props): JSX.Element {
    return (
        <><legend>{legend}</legend>
            <span> {note}</span>

            

                {options.map((option, index) =>
                    <label className="small" key={index}>
                        <input
                            type="radio"
                            name={legend}
                            checked={option === bind[0]}
                            className={option === bind[0]?"radio-checked":""}
                            value={option}
                            onChange={e => bind[1](e.target.value)}
                        />
                        {option}
                    </label>
                )}

            
        </>


    );
};
