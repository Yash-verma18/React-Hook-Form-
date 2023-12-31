import { useForm, useFieldArray, FieldErrors } from "react-hook-form";

import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
// import { useEffect } from "react";
let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

// useFeidArray works only with object values, that is why phNumbers is an array of objects, and each object contains a property called number, where we will store the phone number value

/*
  When a feild is disabled the field becomes undefined and the validation is also disabled. 
*/

export const YoutubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "Batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
    // the mode property allows us to change the mode of validation, You can pass the mode when you want to trigger the validation, By default value is set to onSubmit. We can change the validation mode to onChange, onBlur, onSubmit, onTouched, all, onChange, onBlur, onSubmit, onTouched, all
    // mode: "onTouched",
    // mode: "onChange",
    mode: "all", // this will trigger the validation on onBlur and onChange
  });

  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
  } = form;

  // getValues is a function that will return the current value of the form fields, unlike watch this will not re-render the component when the value of the watched field changes,

  const {
    errors,
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitSuccessful,
    isSubmitted,
    isSubmitting,
    submitCount,
  } = formState;

  // touched : user has focused on the field and then moved away from it
  // console.log("touched", touchedFields);

  // dirty : user has typed something in the field or modified the value of the field this value is compared with the default value of the field.
  // console.log("dirty", dirtyFields);
  // console.log("isDirty", isDirty);

  const onSubmit = (data: FormValues) => {
    // handle submit allows us to get the latest value of data from the form
    console.log("form submitted", data);

    // Its recommended to NOT CALL reset function on OnSubmit, instead use the isSubmitSuccessful property to check if the form was submitted successfully and then call the reset function
  };

  // Lets invoke the useFieldArray hook
  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    // control is getting the control property from the useForm hook
    control,
  });

  // const userWatch = watch("username");
  // const userWatch = watch(["username", "email"]);
  // const watchForm = watch();

  renderCount++;

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log(value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const handleGetValues = () => {
    // console.log("get values", getValues());

    // to log only selected values :
    console.log("get values of username", getValues("username"));
    console.log("get values of username", getValues(["username", "channel"]));
  };

  const handleSetValue = () => {
    setValue("username", "Bruce Wayne");

    // use istouched or isDirty to check if the field has been touched or not
    // setValue("username", "Bruce Wayne", {
    //   shouldValidate: true,
    //   shouldDirty: true,
    //   shouldTouch: true,
    // });
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form Errors", errors);
  };

  // Form Submission State : useful for tracking the progress and outcome of the form submission
  // 1. isSubmitting: boolean; (if a form is in the process of submitting, when the form is submitted this value will be true and becomes false when the form submission is completed)

  // isSubmitting has one great usecase : so when user clicks the submit btn first time, we want to disable the submit btn, so that the user cannot click the submit btn again, so we can use the isSubmitting property to disable the submit btn when the form is submitting. Hence preventing multiple form submissions of the same form.

  // 2. submitCount: number; (this property indicates the number of times the form has been submitted, its incremented by 1 every time the form is submitted, even if the form contains errors, and submit btn is not disabled, this value will be incremented by 1)

  // 3. isSubmitSuccessful: boolean; (this property indicates it the form was submitted successfully without any run time error )

  // 4. isSubmitted: boolean; (if the form submission is successful this value will be true and this remains true until the form is reset)

  // console.log({ isSubmitSuccessful, submitCount });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div>
      <h2>Youtube Form ({renderCount / 2}) </h2>
      {/* <h2>Watched Value {JSON.stringify(watchForm)}</h2> */}

      {/* no validate form attribute will prevent the default browser validation and allowing react hook form to handle the validation on thet field  */}

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="form-control">
          <label htmlFor="username">Username </label>
          <input
            type="text"
            id="username"
            disabled
            {...register("username", {
              required: "Username is required",
            })}
          />

          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email"> Email </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
              //  the function automatically receives the value of the input as the first argument
              // validate: (fieldValue) => {
              //   return (
              //     fieldValue !== "admin@example.com" ||
              //     "Enter a different email address"
              //   );
              // },

              // the validate feild can also be an object
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter a different email address"
                  );
                },
                notBlacklisted: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
                // try to add : this email : Sincere@april.biz
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    "https://jsonplaceholder.typicode.com/users?email=" +
                      fieldValue
                  );
                  const data = await response.json();
                  return data.length === 0 || "Email already exists";
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              // you can also use the required attribute like this
              // required: "Channel is required",
              required: {
                value: true,
                message: "Channel is required",
              },
            })}
          />

          <p className="error">{errors.channel?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              // disabled: watch("channel") === "" ? true : false,
              required: "Twitter is required",
            })}
          />
        </div>
        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
        </div>
        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone Number</label>
          <input
            type="text"
            id="primary-phone"
            {...register("phoneNumbers.0")}
          />
        </div>
        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone Number</label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phoneNumbers.1")}
          />
        </div>

        <div>
          <label>List of phone numbers</label>
          <div>
            {/* we are using the map function to loop through the fields array and render the input fields */}
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        // this will remove the entry from our phnumbers array
                        remove(index);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                // this will add a new entry into our phnumbers array
                append({ number: "" });
              }}
            >
              Add Phone Number
            </button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "Age is required",
              },
            })}
          />

          <p className="error">{errors.age?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="dob">DOB</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: {
                value: true,
                message: "Dob is required",
              },
            })}
          />

          <p className="error">{errors.dob?.message}</p>
        </div>

        <button
        // disabled={!isDirty || !isValid || isSubmitting}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
          }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => {
            handleGetValues();
          }}
        >
          Get Values
        </button>
        <button
          type="button"
          onClick={() => {
            handleSetValue();
          }}
        >
          Set Value
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
