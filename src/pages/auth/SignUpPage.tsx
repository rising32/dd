import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { validateEmail } from '../../lib/utils';
import { onSignUp } from '../../store/features/userSlice';
import { PenSvg } from '../../assets/svg';
import { logoThumbnail } from '../../assets/images';
import { useAppDispatch } from '../../store';

interface IFormInputs {
  email: string;
  phone: string;
  password: string;
  name: string;
}

const SignUpSchema = yup
  .object({
    email: yup.string().required(),
    phone: yup.string().required(),
    password: yup.string().required(),
    name: yup.string().required(),
  })
  .required();

const SignUpPage = () => {
  const navigate = useNavigate();
  const location: any = useLocation();
  const dispatch = useAppDispatch();

  const from = location.state?.from?.pathname || '/tasks';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(SignUpSchema),
  });

  const onSignUpSubmit: SubmitHandler<IFormInputs> = data => {
    if (!validateEmail(data.email)) {
      toast.error('wrong email format!');
      return;
    }
    const params = {
      email: data.email,
      phone_number: data.phone,
      display_name: data.name,
      password: data.password,
      role_id: 3,
    };
    dispatch(onSignUp(params))
      .unwrap()
      .then(res => {
        // console.log(res);
        // dispatch(getAccountSetting({ user_id: res.user.user_id }));
        navigate(from, { replace: true });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-background'>
      <form onSubmit={handleSubmit(onSignUpSubmit)} className='flex flex-col items-center justify-center'>
        <div className='flex items-center justify-start relative w-20 h-20 sm:hidden'>
          <img src={logoThumbnail} alt='Logo' className='h-full w-full' />
          <div className='h-1/3 w-1/3 absolute top-0 -right-1/4'>
            <PenSvg className='h-full w-full' />
          </div>
        </div>
        <div className='font-sans font-bold text-base sm:text-lg lg:text-2xl text-white mt-6 sm:mt-8'>Create a New Account</div>
        <label className='mt-6 w-full relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-6'>
            {/* <img src={person} alt='Crayon' className='h-auto w-4 sm:w-6 lg:w-8' /> */}
          </span>
          <input
            autoComplete='off'
            type='email'
            className='w-full bg-input px-12 py-2 rounded-full text-center text-white placeholder:text-white'
            placeholder='Enter Email'
            {...register('email', { required: true, maxLength: 20 })}
          />
          <p className='text-sm px-6 text-rouge-blue'>{errors.email?.message}</p>
        </label>
        <label className='mt-6 w-full relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-6'>
            {/* <img src={person} alt='Crayon' className='h-auto w-4 sm:w-6 lg:w-8' /> */}
          </span>
          <input
            autoComplete='off'
            className='w-full bg-input px-12 py-2 rounded-full text-center text-white placeholder:text-white'
            placeholder='Enter Name'
            {...register('name', { required: true, maxLength: 20 })}
          />
          <p className='text-sm px-6 text-rouge-blue'>{errors.email?.message}</p>
        </label>
        <label className='mt-6 w-full relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-6'>
            {/* <img src={person} alt='Crayon' className='h-auto w-4 sm:w-6 lg:w-8' /> */}
          </span>
          <input
            autoComplete='off'
            type='text'
            className='w-full bg-input px-12 py-2 rounded-full text-center text-white placeholder:text-white'
            placeholder='Enter Phone'
            {...register('phone')}
          />
          <p className='text-sm px-6 text-rouge-blue'>{errors.email?.message}</p>
        </label>
        <label className='mt-6 w-full relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-6'>
            {/* <img src={password} alt='Crayon' className='h-auto w-4 sm:w-6 lg:w-8' /> */}
          </span>
          <input
            autoComplete='off'
            className='w-full bg-input px-4 py-2 rounded-full text-center text-white placeholder:text-white'
            placeholder='Enter Password'
            type={'password'}
            {...register('password', { required: true, min: 6, max: 25, pattern: /^[A-Za-z]+$/i })}
          />
          <p className='text-sm px-6 text-rouge-blue'>{errors.password?.message}</p>
        </label>
        <div className='mt-6 w-3/4'>
          <button type='submit' className='w-full bg-submit py-2 rounded-full text-center text-white'>
            Sign Up
          </button>
        </div>
        <label className='mt-6 w-3/4'>
          <p className='text-center text-white text-base font-bold underline decoration-solid' onClick={() => navigate('/login')}>
            Already account yet?
          </p>
        </label>
      </form>
    </div>
  );
};

export default SignUpPage;
