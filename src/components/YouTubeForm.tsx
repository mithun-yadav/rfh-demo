import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
export const YouTubeForm = () => {
  type FormValues = {
    username: string;
    email: string;
    channel: string;
    social: {
      twitter: string;
      facebook: string;
    };
    phoneNumber: string[]; // want to keep same kind of info in form of an array
    phNumbers: {
      number: string;
    }[];
    age: number;
    dob: Date;
  };

  const form = useForm<FormValues>({
    defaultValues: async () => {
      const response = await fetch(
        // Use an API to retrieve a value, just to understand that this is also possible.
        "https://jsonplaceholder.typicode.com/users/1"
      );
      const data = await response.json();
      // console.log(data, "val");
      return {
        username: "Mithun",
        email: data.email, // can make default value from an api or database
        channel: "Mit",
        social: {
          // grouping data together
          twitter: "mitTwiiter",
          facebook: "mitFacebook",
        },
        phoneNumber: ["", ""],
        phNumbers: [{ number: "" }],
        age: 0,
        dob: new Date(),
      };
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
  } = form;

  const { errors, touchedFields, dirtyFields, isDirty } = formState;

  console.log(touchedFields, dirtyFields, isDirty, "touch"); // Is touched is for entire form state.

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onsubmit = (data: FormValues) => {
    // console.log(data);
  };

  const handleGetValues = () => {
    //console.log("getValues", getValues()); //giving entire value of all form field
    console.log(
      "getValues",
      //getValues("social.twitter"), // for single input value
      getValues(["username", "channel", "social.twitter"])
    );
  };

  const handleSetValue = () => {
    setValue("username", "", {
      // Programatically set the register field value
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("email", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // const watchValue = watch(["username", "email"]); // It will render the component each time we change somthing in field

  useEffect(() => {
    const subscribe = watch((value) => {
      // This will not re-render each time we change
      // console.log(value);
    });

    return () => subscribe.unsubscribe();
  }, [watch]);

  return (
    <div>
      {/* <h1>YouTube Form {watchValue}</h1> */}
      <h1>YouTube Form</h1>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: {
                value: true,
                message: "Username is require",
              },
            })}
          />{" "}
          {/* //Argument
        in register is the name attribute value */}
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email formate",
              },
              validate: {
                notAdmin: (fieldValue: string) => {
                  // custom error
                  return (
                    fieldValue !== "admin@mail.com" ||
                    "Enter a different email address"
                  );
                },
                notBlackListed: (fieldValue: string) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
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
              required: {
                value: true,
                message: "Channel name is required",
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
              required: {
                value: true,
                message: "Twitter is required",
              },
            })}
          />
          <p className="error">{errors.social?.twitter?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="facebook">facebook</label>
          <input
            type="text"
            id="facebook"
            {...register("social.facebook", {
              required: {
                value: true,
                message: "Facebook is required",
              },
            })}
          />
          <p className="error">{errors.social?.facebook?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone</label>
          <input
            type="text"
            id="primary-phone"
            {...register("phoneNumber.0", {
              required: {
                value: true,
                message: "primary-phone is required",
              },
            })}
          />
          <p className="error">{errors.phoneNumber?.[0]?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone</label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phoneNumber.1", {
              required: {
                value: true,
                message: "secondary-phone is required",
              },
            })}
          />
          <p className="error">{errors.phoneNumber?.[1]?.message}</p>
        </div>
        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button onClick={() => remove(index)}>Remove</button>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={() => append({ number: "" })}>
            Add phone number
          </button>
        </div>
        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              required: {
                value: true,
                message: "Age is required",
              },
              valueAsNumber: true,
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="dob">Date of birth</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              required: {
                value: true,
                message: "Date of birth is required",
              },
              valueAsDate: true,
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>
        <div className="allBtns">
          <button type="submit">Submit</button>
          <button onClick={handleGetValues}>Get Values</button>
          <button onClick={handleSetValue}>Set Values</button>
        </div>
      </form>
      <DevTool control={control} />
    </div>
  );
};
