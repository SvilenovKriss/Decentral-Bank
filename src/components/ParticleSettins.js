import React, { Component } from "react";
import Particles from 'react-tsparticles';

class ParticleSettings extends Component {
    render() {
        return (
            <div>
                <Particles
                    height="1000px"
                    id="tsparticles"
                    options={{
                        background: {
                            color: '#0d47a1'
                        }
                    }}
                />
            </div>
        )
    }
}

export default ParticleSettings;