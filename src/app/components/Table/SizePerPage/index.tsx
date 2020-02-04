import * as React from 'react';

export interface ISizePerPageProps {
    changeSizePerPage: (n: number) => any;
    currSizePerPage: string;
    sizePerPageList?: number[];
}

export class SizePerPage extends React.Component<ISizePerPageProps, {}> {
    public render() {
        return (
            <div className="btn-group">
                {this.getButtons()}
            </div>
        );
    }

    private getButtons() {
        const onButtonClick = (size) => () => this.props.changeSizePerPage(size);

        const buttons = this.props.sizePerPageList.map((size, index) => {
            const isActive = (size === Number(this.props.currSizePerPage)) ? 'active' : '';
            return (
                <button
                    key={index}
                    type="button"
                    className={`btn btn-outline-primary ${isActive}`}
                    onClick={onButtonClick(size)}
                >
                    {size}
                </button>
            );
        });

        return buttons;
    }
}
