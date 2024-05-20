import { BooleanInput, Create, NumberInput, ReferenceField, SelectInput, SimpleForm, TextInput, required } from "react-admin"


export const ChallengeOptionCreate = () => {
    return (
        <Create>
            <SimpleForm  >
                <TextInput  source="text" validate={[required()]} label="Text" />
                <BooleanInput source="correct" label="Correct option" />
                <ReferenceField source="challengeId" reference="challenges" />
                <TextInput source="imageSrc" validate={[required()]} label="Image URl" />
                <TextInput source="audioSrc" validate={[required()]} label="Audio URl" />
            </SimpleForm>
        </Create>
    )
}